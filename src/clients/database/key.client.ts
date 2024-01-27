import { Database } from "./db.client";
import { KeyErrors } from "../../types/err.types";
import { KeyModel } from "../../schemas/keys.schema";
import { InstanceClient } from "../instances/instance.client";
import * as Typings from '../../types/db.types';
import { version } from '../../../package.json';
import crypto from 'crypto';
import { IInstance } from "../../types/instance";
import { createKeyError } from "../../res/errors";

export class Keys {
    private static client: Keys;
    public instance: IInstance;
    public model: typeof KeyModel = KeyModel;
    public static version: string = 'v0.0.1-beta';
    private static errors: typeof KeyErrors = KeyErrors;

    constructor() {

        Keys.client = this

        const instance = InstanceClient.get('CordX:KeyManager', {
            class: Keys,
            model: this.model,
            errors: Keys.errors,
            version: Keys.version,
            create: this.create
        })

        this.instance = instance;
    }

    public static health(): string {
        const instance = InstanceClient.exists('CordX:KeyManager');

        if (!instance.success) return 'UNHEALTHY'

        return 'HEALTHY'
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
                await this.client.model.updateOne({ key: key.key }, { version: this.version }).catch((err: Error) => {
                    return this.client.instance.logs?.trace(this.errors['KEY_VERSION_UPDATE_FAILED']({
                        key: key.key,
                        error: err.stack
                    }));
                })
                this.client.instance.logs?.trace(this.errors['KEY_VERSION_UPDATE_SUCCESS']({
                    msg: 'Cleaned up outdated keys',
                    key: key.key,
                    version: Keys.version,
                }));
            }

            if (key.createdAt < inactive) {
                try {
                    await this.client.model.deleteOne({ key: key.key });
                    this.client.instance.logs?.trace(this.errors['KEY_DELETE_SUCCESS']({
                        msg: 'Cleaned up inactive keys',
                        key: key.key,
                    }));
                } catch (err) {
                    return this.client.instance.logs?.trace(this.errors['KEY_DELETE_FAILED']({
                        key: key.key,
                        error: err instanceof Error ? err.stack : 'Unknown error'
                    }));
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

    public async validate(key: string): Promise<Typings.Responses> {
        return new Promise(async (resolve, reject) => {
            const env = process.env;
            const keyDoc = await this.model.findOne({ key });

            if (!env || !env.ADMIN_KEY || !env.API_KEY) {
                return reject({
                    success: false,
                    status: 'ENV_VALIDATION_FAILED',
                    message: await createKeyError()
                });
            }

            if (key.startsWith('Bearer ')) {

                if (!keyDoc) return reject({
                    success: false,
                    status: 'KEY_NOT_FOUND',
                    message: await createKeyError()
                });

                if (keyDoc.admin) return reject({
                    success: false,
                    status: 'INVALID_KEY_TYPE',
                    message: await createKeyError(),
                    reason: 'Please use a base level api key for this action.'
                })

                if (env.BASE_KEY !== keyDoc.key) return reject({
                    success: false,
                    status: 'API_KEY_MISMATCH',
                    message: await createKeyError()
                })

                return resolve({
                    success: true,
                    message: 'Successfully validated the key.',
                    key: keyDoc
                })

            } else if (key.startsWith('CordXAdmin ')) {

                if (!keyDoc) return reject({
                    success: false,
                    status: 'KEY_NOT_FOUND',
                    message: await createKeyError()
                });

                if (!keyDoc.admin) return reject({
                    success: false,
                    status: 'INVALID_KEY_TYPE',
                    message: await createKeyError(),
                    reason: 'Please use an admin level api key for this action.'
                })

                if (env.ADMIN_KEY !== keyDoc.key) return reject({
                    success: false,
                    status: 'API_KEY_MISMATCH',
                    message: await createKeyError()
                })

                return resolve({
                    success: true,
                    message: 'Successfully validated the key.',
                    key: keyDoc
                })

            } else {
                return reject({
                    success: false,
                    status: 'KEY_VALIDATION_FAILED',
                    message: await createKeyError()
                });
            }
        });
    }
}