import { CordXSnowflake } from "./snowflake.client";
import { InstanceErrors } from "../../types/err.types";
import { CordXError } from "../other/error.client";
import { IInstance } from "../../types/instance";
import { Logger } from "../other/log.client";

export class InstanceClient implements IInstance {
    public static instances: Map<string, IInstance> = new Map();
    private static errors: typeof InstanceErrors = InstanceErrors;
    private static snowflake: CordXSnowflake = new CordXSnowflake();
    private static logger: Logger = Logger.getInstance('INSTANCE:Manager', false)
    private static idleTimeoutDuration: number = 1000 * 60 * 60;
    private static warningInterval: number = 1000 * 60 * 15;
    public static version: string = 'v0.0.1-beta'
    public static state: 'HEALTHY' | 'UNHEALTHY';

    public id: string;
    public name: string;
    public createdAt: Date | null;
    public lastUsed: Date | null;
    public idleTimeout: NodeJS.Timeout | null;
    public idleStart: number | null;
    public state: 'HEALTHY' | 'UNHEALTHY' | 'BUSY' | 'IDLE' | 'DESTROYED' | 'CLEANSING' | 'CLEANSED';
    public properties: any;
    public logs: Logger | null = null;

    private constructor(id: string, name: string, properties: any) {
        this.id = id;
        this.name = name;
        this.createdAt = new Date();
        this.lastUsed = new Date();
        this.idleTimeout = null;
        this.idleStart = null;
        this.state = 'HEALTHY';
        this.logs = Logger.getInstance(`INSTANCE:${name}(${id})`, false);
        this.properties = properties;
        this.monitor()
    }

    public static health(): string {
        const instance = this.exists('INSTANCE:Manager');

        if (!instance) this.state = 'UNHEALTHY';

        return this.state = 'HEALTHY'
    }

    /**
     * @function healthy
     * @description get all healthy instances.
     * @returns {IInstance[]}
     * @memberof InstanceClient
     */

    public static healthy(): IInstance[] {
        const data = this.instances.values();
        return Array.from(data).filter((instance: IInstance) => {
            return ['HEALTHY', 'IDLE', 'BUSY'].includes(instance.state)
        })
    }

    /**
     * @function unhealthy
     * @description get all unhealthy instances.
     * @returns {IInstance[]}
     * @memberof InstanceClient
     */
    public static unhealthy(): IInstance[] {
        return Array.from(this.instances.values()).filter((instance: IInstance) => {
            return ['UNHEALTHY', 'DESTROYED', 'CLEANSING', 'CLEANSED'].includes(instance.state) || null;
        });
    }

    public static exists(name: string): { success: boolean, message: string } {
        const instance = this.instances.get(name);

        if (!instance) return {
            success: false,
            message: 'Instance not found.'
        };

        return {
            success: true,
            message: 'Instance found.'
        };
    }

    /**
     * @function create
     * @description create a new instance.
     * @param {string} name the name of the instance.
     * @param {any} properties the properties of the instance.
     * @returns {Promise<IInstance>}
     */
    public static create(name: string, properties: any): IInstance {
        const id = InstanceClient.snowflake.generate();
        const instance = new InstanceClient(id, name, properties);
        this.instances.set(name, instance);
        InstanceClient.logger.info(`Successfully created new instance: ${name} (${id})`);
        InstanceClient.logger.info(`Total instances currently: ${this.instances.size}`);
        return instance;
    }

    /** 
     * @function get
     * @description get an instance based on its name, if the instance does not exist, it will be created using the provided properties.
     * @param {string} name the name of the instance.
     * @param {any} properties the properties of the instance.
     * @returns {Promise<IInstance>}
     * @memberof InstanceClient
     */
    public static get(name: string, properties: any): IInstance {
        InstanceClient.logger.info(`Getting instance with name ${name}`);
        let client = InstanceClient.instances.get(name);

        if (!client) {
            client = this.create(name, properties);
        } else {
            this.logger.info(`Successfully retrieved instance: ${name} (${client.id})`);
        }

        return client;
    }

    /**
     * @function execute
     * @description execute a operation on the instance and update its last used time.
     * @param {string} operation the operation being executed (i.e. perform a database query)
     * @property {string} connect establish a database connection (typically mongoose).
     * @property {boolean} connected whether or not the database is already connected.
     * @property {string} state the current state of the instance (IDLE or HEALTHY are needed here).
     * @memberof InstanceClient
     * @returns {void}
     */
    public execute(operation: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this) return reject(InstanceClient.errors['INSTANCE_NOT_FOUND']({
                message: `Hmm, something is seriously wrong. We couldn't find that instance.`
            }))

            if (this.state !== 'HEALTHY' && this.state !== 'IDLE') return reject(InstanceClient.errors['UNHEALTHY_EXECUTION']({
                message: `Woah, you can't execute operations on an unhealthy instance.`,
                state: 'The current state of this instance is: ' + this.state,
                fix: 'Please wait for the instance to become healthy or clean it up and make a new one.'
            }));

            if (!this.properties.connected) {
                this.setState('UNHEALTHY');
                return reject(InstanceClient.errors['INSTANCE_CONNECTION_FAILED']({
                    message: `Failed to execute operation on instance: ${this.name}(${this.id})`,
                    reason: 'The connection should be established before executing operations on the instance.',
                }));
            }

            if (operation == 'connect') {
                if (this.properties.hasOwnProperty('connect')) {

                    this.setState('BUSY');

                    this.properties.connect().then(() => {
                        this.lastUsed = new Date();
                        this.setState('HEALTHY');
                        this.properties.connected = true;
                        resolve(this.logs?.trace(InstanceClient.errors['INSTANCE_CONNECTION_SUCCESS']({
                            message: `Successfully established a connection.`,
                            instance: this.name + '(' + this.id + ')',
                            database: this.name || 'MongoDB'
                        })));
                    }).catch((err: Error) => {
                        this.setState('UNHEALTHY');
                        return reject(this.logs?.fatal(InstanceClient.errors['INSTANCE_CONNECTION_FAILED']({
                            message: `Failed to establish a connection.`,
                            instance: this.name + '(' + this.id + ')',
                            database: this.name || 'MongoDB',
                            stack: err.stack
                        })));
                    })
                }
            }
        })
    }

    /**
     * @function cleanup
     * @description cleanup the instance and properly dismiss its properties/resources.
     * @summary instances cannot be destroyed until they are cleaned up, this is to prevent memory leaks.
     * @returns {Promise<boolean>}
     * @memberof InstanceClient
     * @example
     * const instance = InstanceClient.instances.get('myInstance');
     * instance.cleanup().then((cleanedUp: boolean) => {
     *    if (cleanedUp) {
     *      // do something
     *   }
     * }).catch((err: Error) => {
     *   // handle error
     * })
     */
    public cleanup(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const client = InstanceClient.instances.get(this.name);

            if (!this) return reject(InstanceClient.errors['INSTANCE_NOT_FOUND']({
                message: `Unable to locate that instance.`,
            }));

            this.state = 'CLEANSING';

            if (this.properties && this.properties.hasOwnProperty('connection')) {
                this.properties.connection.close().then(() => {
                    InstanceClient.logger.info(`Database connection closed for instance: ${this.name}(${this.id})`);
                    this.properties = null;
                }).catch((err: Error) => {
                    this.state = 'UNHEALTHY'
                    return reject(InstanceClient.logger.fatal(InstanceClient.errors['INSTANCE_CLEANUP_FAILED']({
                        message: `Failed to close database connection for instance: ${this.name}(${this.id})`,
                        stack: err.stack
                    })))
                })
            }

            if (this.idleTimeout) {
                clearInterval(this.idleTimeout);
                this.idleTimeout = null;
                this.idleStart = null;
            }

            if (this.logs) {
                this.logs = null;
            }

            this.state = 'CLEANSED';

            return resolve(true);
        })
    }

    /**
     * @function destroy
     * @description destroy the instance and remove it from the instance pool.
     * @summary instances cannot be destroyed until they are cleaned up, this is to prevent memory leaks.
     * @returns {Promise<boolean>}
     * @memberof InstanceClient
     * @example
     * const instance = InstanceClient.instances.get('myInstance');
     * instance.destroy().then((destroyed: boolean) => {
     *   if (destroyed) {
     *     // do something
     *  }
     * }).catch((err: Error) => {
     *  // handle error
     * })
     */
    public async destroy(): Promise<boolean> {
        try {
            if (!this) throw InstanceClient.logger.fatal(InstanceClient.errors['INSTANCE_NOT_FOUND']({
                message: `Hmm, something went wrong. We couldn't find that instance.`,
            }));

            if (this.state !== 'CLEANSED') throw InstanceClient.logger.fatal(InstanceClient.errors['INSTANCE_DESTROY_FAILED']({
                message: `Woah, you need to cleanup that instance before you can destroy it.`,
                fix: 'Please call the "cleanup()" method on this instance before destroying it.'
            }));

            InstanceClient.instances.delete(this.name)

            return true;
        } catch (err: any) {
            throw InstanceClient.logger.fatal(InstanceClient.errors['INSTANCE_DESTROY_FAILED']({
                message: `Failed to destroy instance: ${this.name}(${this.id})`,
                stack: err.stack
            }));
        }
    }

    /**
     * @function cleanse
     * @description cleanse any dirty instances.
     * @memberof InstanceClient
     * @returns {Promise<IInstance>}
     */
    public static async cleanse(): Promise<Partial<IInstance>[] | CordXError> {
        return new Promise((resolve, reject) => {
            const array = Array.from(this.instances.values());

            if (array.length === 0) return resolve(this.errors['NO_DIRTY_INSTANCES']({
                message: `Great news, there are no dirty instances to clean up.`,
            }));

            const keysToRemove: string[] = [];
            const cleanedUp: Partial<IInstance>[] = [];
            const errors: any[] = [];

            for (const [key, client] of this.instances.entries()) {
                if (['UNHEALTHY', 'DESTROYED'].includes(client.state)) {
                    try {
                        client.state = 'CLEANSING';
                        client.cleanup().catch((err: Error) => {
                            errors.push(err);
                        });
                        cleanedUp.push({
                            id: client.id,
                            name: client.name,
                            createdAt: client.createdAt,
                            lastUsed: client.lastUsed,
                            state: client.state,
                        })
                    } catch (error) {
                        errors.push(error);
                    } finally {
                        keysToRemove.push(key);
                    }
                }
            }

            this.logger.info(`Cleaning up ${cleanedUp.length} instances.`);

            for (const key of keysToRemove) {
                this.instances.delete(key);
            }

            if (errors.length > 0) return reject(this.errors['INSTANCE_CLEANUP_FAILED']({
                message: `Failed to cleanup ${errors.length} instances.`,
                details: [
                    '- This is a fatal error caused by improper instance setup/usage.',
                ],
                stack: [
                    ...errors.map((err: Error) => err.stack)
                ]
            }));

            return resolve(cleanedUp);
        })
    }

    /**
     * @function monitor
     * @description monitor the instance and warn/destroy it if it has been idle for too long.
     * @returns {Promise<void>}
     * @memberof InstanceClient
     */
    private async monitor(): Promise<void> {
        const instance = this;

        if (!instance) return;

        instance.setState('BUSY')

        if (instance.idleTimeout) {
            instance.setState('BUSY')
            clearInterval(instance.idleTimeout);
            instance.idleTimeout = null;
            instance.idleStart = null;
            instance.setState('IDLE')
        }

        let count = 0;
        const max: number = InstanceClient.idleTimeoutDuration / InstanceClient.warningInterval;

        const warnAndClose = () => {
            if (instance.lastUsed) {
                const currentTime = Date.now();
                const lastUsedTime = instance.lastUsed.getTime();
                const idleDuration = currentTime - lastUsedTime;

                if (idleDuration < InstanceClient.idleTimeoutDuration) {
                    instance.logs?.info(`Instance: ${instance.name}(${instance.id}) has been idle for ${idleDuration / 1000 / 60} minutes`);
                    instance.logs?.warn(`Idle instances are destroyed after: ${InstanceClient.idleTimeoutDuration / 1000 / 60} minutes of inactivity`);
                    instance.logs?.info('If you wish to keep this instance alive please perform an operation on it to reset its internal state.')
                    count++;
                    if (count >= max) {
                        instance.setState('CLEANSING')
                        instance.logs?.warn(`Instance: ${instance.name}(${instance.id}) has been idle for ${idleDuration / 1000 / 60} minutes.`);
                        instance.logs?.fatal(`This instance has been idle for to long and will be destroyed to prevent memory leaks/overloads.`)

                        this.cleanup().then(() => {
                            instance.setState('CLEANSED')
                            instance.logs?.success(`Instance: ${instance.name}(${instance.id}) has been cleaned up successfully!`);
                        }).catch((err: Error) => {
                            instance.setState('UNHEALTHY')
                            instance.logs?.warn(`Instance: ${instance.name}(${instance.id}) encountered an error during cleanup`);
                            return instance.logs?.fatal(`Error: ${err.stack}`)
                        })
                        instance.destroy().catch((err: Error) => {
                            instance.setState('UNHEALTHY')
                            instance.logs?.warn(`Failed to destroy instance: ${instance.name}(${instance.id})`);
                            return instance.logs?.fatal(`Error: ${err.message}`)
                        })
                    }
                } else {

                    instance.setState('CLEANSING')

                    instance.logs?.warn(`Instance: ${instance.name}(${instance.id}) has been idle for ${idleDuration / 1000 / 60} minutes.`);
                    instance.logs?.fatal(`This instance has been idle for to long and will be destroyed to prevent memory leaks/overloads.`)

                    this.cleanup().catch((err: Error) => {
                        instance.setState('UNHEALTHY')
                        instance.logs?.warn(`Instance: ${instance.name}(${instance.id}) encountered an error during cleanup`);
                        return instance.logs?.fatal(`Error: ${err.stack}`)
                    })
                    instance.setState('DESTROYED')
                    instance.destroy().catch((err: Error) => {
                        instance.setState('UNHEALTHY')
                        instance.logs?.warn(`Failed to destroy instance: ${instance.name}(${instance.id})`);
                        return instance.logs?.fatal(`Error: ${err.message}`)
                    });
                }
            }
        }

        instance.setState('HEALTHY')

        instance.idleTimeout = setInterval(warnAndClose, InstanceClient.warningInterval);
    }

    /**
     * @function setState
     * @description set the state of the instance.
     * @param {IInstance['state']} state the state to set.
     * @returns {(void | string)}
     * @memberof InstanceClient
     * @throws {CordXError} if the state is invalid.
     */
    public setState(state: IInstance['state']): void | string {
        if (!this) return;

        const valid = ['HEALTHY', 'UNHEALTHY', 'BUSY', 'IDLE', 'DESTROYED', 'CLEANSING', 'CLEANSED']

        if (!valid.includes(state)) return this.logs?.fatal(InstanceClient.errors['INSTANCE_INVALID_STATE']({
            message: `You are attempting to set an invalid state for instance: ${this.name}(${this.id})`,
            available: ['HEALTHY', 'UNHEALTHY', 'BUSY', 'IDLE', 'DESTROYED', 'CLEANSING', 'CLEANSED'],
        }));

        return this.state = state;
    }

    public setLastUsed(): any {
        if (!this) return;

        if (this.state === 'IDLE') this.setState('HEALTHY');

        return this.lastUsed = new Date();
    }

    /**
     * @function info
     * @description get the info of the instance.
     * @returns {(Partial<IInstance> | void)}
     * @memberof InstanceClient
     * @example
     * const instance = InstanceClient.instances.get('myInstance');
     * const info = instance.info;
     * console.log(info);
     */
    public view(): Partial<IInstance> {

        if (!this) InstanceClient.logger.fatal(InstanceClient.errors['INSTANCE_NOT_FOUND']({
            message: `Hmm, something went wrong. We couldn't find that instance.`,
        }));

        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
            lastUsed: this.lastUsed,
            idleTimeout: this.idleTimeout,
            idleStart: this.idleStart,
            state: this.state,
        }
    }

    public static count(): number {
        return this.instances.size;
    }
}