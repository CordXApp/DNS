import { Database } from "./db.client";
import { KeyErrors } from "../../types/err.types";
import { KeyModel } from "../../schemas/keys.schema";
import { InstanceClient } from "../instances/instance.client";
import * as Typings from '../../types/db.types';
import { IInstance } from "../../types/instance";
import { createKeyError } from "../../res/errors";
import crypto from 'crypto';

export class Keys {
    private static client: Keys;
    public instance: IInstance;
    public model = KeyModel;
    public static version: string = '0.0.1-beta';
    private static errors: typeof KeyErrors = KeyErrors;

    constructor() {

        Keys.client = this
        Keys.cleanup()
        Keys.init()

        const instance = InstanceClient.get('CordX:KeyManager', {
            model: this.model,
            errors: Keys.errors,
            version: Keys.version,
            create: this.create,
            random: this.random,
            validate: this.validate
        })

        this.instance = instance;
    }

    public static health(): string {
        const instance = InstanceClient.exists('CordX:KeyManager');

        if (!instance.success) return 'UNHEALTHY'

        return 'HEALTHY'
    }

    /**
     * @function init
     * @description Initialize the key client and validate the env file.
     */
    public static async init(): Promise<void> {
        const baseCheck = await this.client.model.countDocuments({ admin: false });
        const adminCheck = await this.client.model.countDocuments({ admin: true });

        if (!baseCheck) {
            await this.client.instance.logs?.warn(`No base level api keys found, creating one now...`);
            await this.client.create(false).then(async (key) => {
                this.client.instance.logs?.success(`Successfully created a new base level api key in our database.`);
                this.client.instance.logs?.success(`Please add this to your ".env" file: "BASE_KEY=${key.key}"`);
            }).catch((err: Error) => {
                this.client.instance.logs?.fatal(`Error creating api key: ${err.stack}`);
                return process.exit(1)
            })
        } else if (!adminCheck) {
            await this.client.instance.logs?.warn(`No admin level api keys found, creating one now...`);
            await this.client.create(true).then(async (key) => {
                this.client.instance.logs?.success(`Successfully created a new base level api key in our database.`);
            }).catch((err: Error) => {
                this.client.instance.logs?.fatal(`Error creating api key: ${err.stack}`);
                return process.exit(1);
            })
        } else {
            this.client.instance.logs?.success('Successfully validated/created necessary api keys');
            this.client.instance.logs?.info(`Environment variables will now be checked/validated`);
        }

        const env = process.env;
        const base = await this.client.model.findOne({ admin: false });

        if (!env) {
            this.client.instance.logs?.error(`Env validation failed: please make sure you have a ".env" file in your root directory`);
            return process.exit(1);
        } else if (!env.BASE_KEY) {
            this.client.instance.logs?.fatal(`Env validation failed: please make sure you have a "BASE_KEY" variable with a valid CordX API KEY`);
            this.client.instance.logs?.info(`If you need an api key you can add this one to your ".env" file: "BASE_KEY=${base.key}"`);
            return process.exit(1);
        } else if (env.BASE_KEY) {
            if (env.BASE_KEY !== base.key) {
                this.client.instance.logs?.fatal(`Env validation failed: please make sure you have a "BASE_KEY" variable with a valid CordX API KEY`)
                this.client.instance.logs?.info(`If you need an api key you can add this one to your ".env" file: "BASE_KEY=${base.key}"`);
                return process.exit(1);
            } else if (!await this.client.model.findOne({ key: env.BASE_KEY })) {
                this.client.instance.logs?.fatal(`Env validation failed: please make sure you have a "BASE_KEY" variable with a valid CordX API KEY`)
                this.client.instance.logs?.info(`If you need an api key you can add this one to your ".env" file: "BASE_KEY=${base.key}"`);
            }
        }

        this.client.instance.logs?.success('Env validation completed successfully!');
    }

    /**
     * @function cleanup
     * @description Clean up outdated or inactive keys.
     * @returns {Promise<void>}
     * @memberof Keys
     * @todo Add a proper "lasUsed" property to the key schema.
     */
    public static async cleanup(): Promise<void> {
        const keys = await this.client.model.find();

        const inactive = Date.now() - 1000 * 60 * 60 * 24 * 30;

        for (const key of keys) {
            if (!key.version || key.version !== this.version) {
                await this.client.model.updateOne({ key: key.key }, { version: this.version }).then(() => {
                    this.client.instance.logs?.success(`Updated version for ${key.admin ? 'Admin Key' : 'Base Key'}: ${key.key}`)
                }).catch((err: Error) => {
                    this.client.instance.logs?.error(`Failed to update version for key: ${key.key}`)
                    return this.client.instance.logs?.fatal(`Error: ${err.stack}`)
                })

                this.client.instance.logs?.success(`All keys are up-to date`);
            }

            if (key.createdAt < inactive) {
                try {
                    this.client.instance.logs?.success(`Deleting ${key.admin ? 'Admin Key' : 'Base Key'}: ${key.key} for inactivity`);

                    await this.client.model.deleteOne({ key: key.key }).catch((err: any) => {
                        this.client.instance.logs?.error(`Failed to delete key: ${key.key}`);
                        return this.client.instance.logs?.fatal(`Error: ${err.stack}`)
                    });
                } catch (err) {
                    this.client.instance.logs?.error(`Failed to delete or check key: ${key.key} for inactivity`)
                    return this.client.instance.logs?.fatal(`Error: ${err instanceof Error ? err.stack : 'Unknown'}`);
                }
            }
        }
    }

    public async create(admin: boolean): Promise<Typings.Responses> {
        const exists = InstanceClient.exists('CordX:Database');

        if (!exists.success) return {
            success: false,
            message: 'Unable to locate a database instance, please report this to our support team if this issue continues.',
        }

        const key = crypto.randomBytes(32).toString('hex');
        let keyDoc = await this.model.findOne({ key });

        if (keyDoc) return await this.create(admin);

        if (!keyDoc) keyDoc = await this.model.create({ key, admin });

        return {
            success: true,
            message: 'Successfully created a new key.',
            key: keyDoc
        }
    }

    public async delete(key: string): Promise<Typings.Responses> {
        const exists = InstanceClient.exists('Database');

        if (!exists.success) return {
            success: false,
            message: 'Unable to locate a database instance, please report this to our support team if this issue continues.',
        }

        const keyDoc = await this.model.findOne({ key });

        if (!keyDoc) return {
            success: false,
            message: 'Unable to locate that key.',
        }

        await this.model.deleteOne({ key });

        return {
            success: true,
            message: 'Successfully deleted the key.',
        }
    }

    public async get(key: string): Promise<Typings.Responses> {
        const exists = InstanceClient.exists('Database');

        if (!exists.success) return {
            success: false,
            message: 'Unable to locate a database instance, please report this to our support team if this issue continues.',
        }

        const keyDoc = await this.model.findOne({ key });

        if (!keyDoc) return {
            success: false,
            message: 'Unable to locate that key.',
        }

        return {
            success: true,
            message: 'Successfully retrieved the key.',
            key: keyDoc
        }
    }

    /**
     * @function validate
     * @description Validate a key and return the status.
     * @param {string} key The key to validate.
     * @param {Typings.KeyType['level']} requires The level of access required.
     * @returns {Promise<Typings.Responses>}
     * @memberof Keys
     */
    public async validate(key: string, requires: Typings.KeyType['level']): Promise<Typings.Responses> {

        if (key.startsWith('Bearer ')) {

            const doc = await this.model.findOne({ key: key.replace('Bearer ', '') });

            if (!doc) return {
                success: false,
                status: 'KEY_NOT_FOUND',
                message: createKeyError(),
                code: 404
            }

            if (requires == 'ADMIN') return {
                success: false,
                status: 'ADMIN_KEY_REQUIRED',
                message: createKeyError(),
                code: 401
            }

            if (process.env.BASE_KEY && process.env.BASE_KEY !== doc.key) return {
                success: false,
                status: 'INVALID_API_KEY',
                message: createKeyError(),
                code: 401
            }
        }

        else if (key.startsWith('CordXAdmin ')) {

            const doc = await this.model.findOne({ key: key.replace('CordXAdmin ', '') });

            if (!doc) return {
                success: false,
                status: 'KEY_NOT_FOUND',
                message: createKeyError(),
                code: 404
            }

            if (requires == 'BASIC') return {
                success: true,
                status: 'ADMIN_KEY_BYPASS',
                code: 200
            }
        }

        return {
            success: true,
            status: 'KEY_IS_VALID',
            code: 200
        }
    }

    public async random(admin: boolean): Promise<Typings.Responses> {
        let key;

        if (admin) key = this.model.findOne({ admin: true })
        else key = this.model.findOne({ admin: false })

        return {
            success: true,
            status: 'RANDOM_KEY_FETCH',
            key: key
        }
    }
}