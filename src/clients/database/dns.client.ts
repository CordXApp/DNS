import dns from 'node:dns';
import net from 'node:net';
import { Logger } from '../other/log.client';
import { KEYWORDS, BLACKLIST } from '../../types/keywords';
import { UserModel } from '../../schemas/user.schema';
import { DNSResponses } from '../../types/interfaces';
import { IInstance } from '../../types/instance';
import { InstanceClient } from '../instances/instance.client';

export class DNSClient {

    public instance: IInstance;
    private static logs: Logger;
    public static version: string = '0.0.1-beta';
    private model: typeof UserModel = UserModel;

    constructor() {
        this.instance = InstanceClient.get('CordX:DNS', {
            class: DNSClient,
            keywords: KEYWORDS,
            check: this.check,
            blacklisted: this.blacklisted,
            resolve: this.resolve,
            validate: this.validate,
            verified: this.verified,
            model: this.model
        })
    }

    /**
     * @method blacklisted
     * @description Checks if a domain is blacklisted.
     * @param domain The domain to check.
     * @returns A boolean.
     * @tutorial `DNSClient.blacklisted('google.com')`
     */
    public blacklisted = (domain: string): boolean => {
        const config: BLACKLIST = { blacklist: this.instance.properties.KEYWORDS };
        const isBlacklisted = config.blacklist.some((key) => domain.toLowerCase().includes(key.toLowerCase()))

        DNSClient.logs.info(`Domain ${domain} is ${isBlacklisted ? 'blacklisted' : 'not blacklisted'}.`);

        return isBlacklisted;
    }

    /**
     * @method filter
     * @description Filters a subdomain to get its main domain.
     * @param domain The domain to filter.
     * @returns The main domain.
     * @example
     * console.log(DNSClient.filter('www.google.com')) // Returns 'google.com'
     */
    private static filter(domain: string): string {
        const parts = domain.split('.');
        const main = parts.slice(-2).join('.');

        return main;
    }

    /**
     * @method check
     * @description Checks if a domain has a specific TXT record.
     * @param domain The domain to check.
     * @param record The record to check for.
     * @returns A promise that resolves to a boolean.
     * @tutorial `await DNSClient.check('google.com', 'google-site-verification=...')`
     */
    public async check(domain: string, record: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            DNSClient.logs.info(`Checking domain ${domain} for txt record ${record}.`);

            domain = DNSClient.filter(domain);

            dns.resolveTxt(domain, (error, records) => {
                if (error) {
                    DNSClient.logs.error(`Failed to check domain ${domain} for txt record ${record}: ${error.message}`);
                    reject(error);
                    return;
                }

                if (!records) {
                    DNSClient.logs.error(`Failed to check domain ${domain} for txt record ${record}: No records found.`);
                    reject(new Error('No records found.'));
                    return;
                }

                const found = records.some((r: string[]) => r.includes(record));

                if (!found) {
                    DNSClient.logs.error(`Failed to check domain ${domain} for txt record ${record}: Record not found.`);
                    resolve(false);
                    return;
                }

                DNSClient.logs.info(`Successfully checked domain ${domain} for txt record ${record}.`);

                resolve(true);
            })
        })
    }

    /**
     * @method resolve
     * @description Resolves a domain to an IP address.
     * @param domain The domain to resolve.
     * @returns A promise that resolves to an object.
     * @tutorial `await DNSClient.resolve('google.com')`
     */
    public async resolve(domain: string): Promise<{ success: boolean, data?: { addresses: string[], domain: string } }> {
        return new Promise((resolve, reject) => {
            dns.resolve(domain, (error, addresses) => {
                if (error) {
                    DNSClient.logs.error(`Failed to resolve domain ${domain}: ${error.stack}`);
                    reject({ success: false, message: error.message });
                }

                if (!addresses) {
                    DNSClient.logs.error(`Failed to resolve domain ${domain}: No addresses found.`);
                    reject({ success: false, message: 'No addresses found.' });
                }

                if (addresses.length < 1) {
                    DNSClient.logs.error(`Failed to resolve domain ${domain}: No addresses found.`);
                    reject({ success: false, message: 'No addresses found.' });
                }

                resolve({ success: true, data: { addresses: addresses, domain: domain } });
            });
        });
    }

    /**
     * @method validate
     * @description Validates a domain is not an IP Address.
     * @param domain The domain to validate.
     * @returns A promise that resolves to a DNS_Validate object.
     * @tutorial `await DNSClient.validate('google.com')`
     * @typedef {object} DNS_Validate
     */
    public validate(domain: string): Promise<DNSResponses['validate']> {
        return new Promise((resolve, reject) => {
            if (typeof domain !== 'string') {
                DNSClient.logs.error(`Failed to validate domain ${domain}: Domain must be a string.`);
                resolve({ success: false, message: 'Domain must be a string.' });
                return;
            }

            if (domain.length > 253) {
                DNSClient.logs.error(`Failed to validate domain ${domain}: Domain is too long.`);
                resolve({ success: false, message: 'Domain is too long.' });
                return;
            }

            if (net.isIP(domain)) {
                DNSClient.logs.error(`Failed to validate domain ${domain}: IP addresses are not allowed.`);
                resolve({ success: false, message: 'IP addresses are not allowed.' });
                return;
            }

            if (this.blacklisted(domain)) {
                DNSClient.logs.error(`Failed to validate domain ${domain}: Domain is blacklisted.`);
                resolve({ success: false, message: 'Domain is blacklisted.' });
                return;
            }

            const pattern = new RegExp('^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$');
            const parts = domain.split('.');

            for (let part of parts) {
                if (!pattern.test(part)) {
                    DNSClient.logs.error(`Failed to validate domain ${domain}: Domain part ${part} is invalid.`);
                    resolve({ success: false, message: `Domain part ${part} is invalid.` });
                    return;
                }
                if (part.length > 63) {
                    DNSClient.logs.error(`Failed to validate domain ${domain}: Domain part ${part} is too long.`);
                    resolve({ success: false, message: `Domain part ${part} is too long.` });
                    return;
                }

                if (!/^[a-z0-9-]+$/i.test(part)) {
                    DNSClient.logs.error(`Failed to validate domain ${domain}: Domain part ${part} contains invalid characters.`);
                    resolve({ success: false, message: `Domain part ${part} contains invalid characters.` });
                    return;
                }
            }

            return resolve({ success: true, message: 'Domain is valid.' });
        })
    }

    /**
     * @method verified
     * @description Checks if a domain is verified.
     * @param domain The domain to check.
     * @returns A promise that resolves to a DNS_Verify object.
     * @tutorial `await DNSClient.verified('google.com')`
     */
    public verified(domain: string): Promise<DNSResponses['verify']> {
        return new Promise(async (resolve, reject) => {
            const dom = await UserModel.findOne({ 'domains.name': domain });
            const doc = await dom.domains.find((d: any) => d.name === domain);

            if (!dom) {
                DNSClient.logs.error(`Failed to fetch ${domain}: user does not exist`);
                resolve({ success: false, message: 'User does not exist!' });
                return;
            }

            if (!doc) {
                DNSClient.logs.error(`Failed to fetch ${domain}: domain does not exist`);
                resolve({ success: false, message: 'Domain does not exist.' });
                return;
            }

            if (!doc.verified) {
                DNSClient.logs.error(`${domain}:  is not verified`);
                resolve({ success: false, message: 'Domain is not verified!' });
                return;
            }

            DNSClient.logs.info(`${domain} is verified!`);
            resolve({ success: true, message: 'Domain is verified!' });
        })
    }

    public async domain(domain: string): Promise<{ success: boolean, message?: string, data?: any }> {
        const validate = await this.validate(domain);

        if (!validate.success) return {
            success: false,
            message: validate.message
        }

        const dom = await this.model.findOne({})

        return {
            success: true,
            data: dom
        }
    }
}