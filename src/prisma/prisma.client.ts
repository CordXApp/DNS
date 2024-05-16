import { PrismaClient } from '@prisma/client';
import { Logger } from '../clients/other/log.client';
import crypto from "node:crypto";
import dns from "node:dns";
import net from "node:net";

import {
    DBClient,
    Parameters,
    ResponseLayout,
    BlacklistConfig,
    BLACKLISTED_KEYWORDS
} from "../types/clients/db.types";

export class Database implements DBClient {
    private logs: Logger;
    private prisma: PrismaClient;

    constructor() {
        this.logs = new Logger('[DNS:Prisma]', false);
        this.prisma = new PrismaClient();
    }

    public get domain() {
        return {
            create: async (params: Parameters): Promise<ResponseLayout> => {

                if (!params.domain) return { success: false, message: 'Please provide a domain name' };
                if (!params.owner) return { success: false, message: 'Please provide a domain owner' };

                const validate = await this.domain.validate({ domain: params.domain });

                if (!validate.success) return { success: false, message: validate.message };

                const create = await this.prisma.domains.create({
                    data: {
                        name: params.domain,
                        content: crypto.randomBytes(15).toString('hex'),
                        verified: false,
                        user: params.owner
                    }
                });

                return {
                    success: true,
                    message: 'Domain created successfully',
                    data: create
                }
            },
            fetch: async (params: Parameters): Promise<ResponseLayout> => {
                const dom = await this.prisma.domains.findUnique({ where: { name: params.domain } });

                if (!dom) return { success: false, message: 'Domain not found' };

                return {
                    success: true,
                    message: 'Domain found',
                    data: dom
                }
            },
            exists: async (params: Parameters): Promise<boolean> => {
                const dom = await this.prisma.domains.findUnique({ where: { name: params.domain } });

                return dom ? true : false;
            },
            blacklisted: async (params: Parameters): Promise<boolean> => {
                const isBlacklisted = params.config?.blacklist.some((word) => params.domain.includes(word));

                return isBlacklisted ? true : false;
            },
            removeSubdomain: (params: Parameters): string => {
                const parts = params.domain.split('.');
                const root = parts.slice(-2).join('.');

                return root;
            },
            validate: async (params: Parameters): Promise<ResponseLayout> => {
                const isNotIP = net.isIP(params.domain) != 0;

                if (isNotIP) return { success: false, message: 'Please provide a domain name (IP Addresses are not yet supported)' };

                const pattern = new RegExp('^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$');

                const parts = params.domain.split('.');

                if (parts.length < 2) return { success: false, message: 'Please provide a valid domain name' };
                if (parts.every(part => pattern.test(part))) return { success: true, message: 'Please provide a valid domain name' };

                if (/\\|https?:\/\//.test(params.domain)) return {
                    success: false,
                    message: params.domain.includes('\\') ? 'Error: escape sequence detected, please check your params' : 'Please provide a domain name without the http(s) protocol'
                };

                const config: BlacklistConfig = { blacklist: BLACKLISTED_KEYWORDS };
                const blacklisted = await this.domain.blacklisted({ domain: params.domain, config });

                if (blacklisted) return { success: false, message: 'Domain name is blacklisted' };

                return { success: true, message: 'Domain name is valid' };
            },
            verifyRecord: (params: Parameters): Promise<boolean> => {
                return new Promise(async (resolve, reject) => {
                    const domain = await this.domain.fetch({ domain: params.domain });

                    if (!domain.success) return reject(false);

                    dns.resolve(this.domain.removeSubdomain({ domain: params.domain }), (err, records) => {
                        if (err) return reject(false);

                        const exists = records.some((record) => record.includes(domain.data.content));

                        resolve(exists);
                    })
                })
            }
        }
    }

    public get domain_stats() {
        return {
            total: async (): Promise<number> => {
                const total = await this.prisma.domains.count();

                return total;
            }
        }
    }
}