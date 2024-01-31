import { DatabaseErrors } from '../../types/err.types';
import { InstanceClient } from '../instances/instance.client';
import { IInstance } from '../../types/clients/instance.types';
import * as DBTypes from '../../types/clients/db.types';
import { Properties } from '../../types/clients/db.types';
import { Logger } from '../other/log.client';
import { CordXError } from '../other/error.client';
import { DNSClient } from './dns.client';
import { Connection } from 'mongoose';
import { Keys } from './key.client';
import mongo from 'mongoose';

export class Database implements DBTypes.Client {
    private static errors: { [status: string]: (details?: any) => Error } = DatabaseErrors;
    private static logger: Logger = Logger.getInstance('CordX:Database', false);
    private static connection: Connection = mongo.connection;
    private static uri: string = process.env.MONGO_URI as string;
    public instance: IInstance<DBTypes.Properties>;
    public dns: DNSClient = new DNSClient()
    public keys: Keys = new Keys()

    public static version: string = '0.0.1-beta';

    constructor() {

        this.instance = InstanceClient.get('CordX:Database', {
            mongoose: mongo,
            connect: this.connect.bind(this),
            disconnect: this.disconnect.bind(this)
        }) as unknown as IInstance<Properties>;

        Database.connection = mongo.connection;

        this.connect().catch((err: Error) => {
            Database.logger.error(`Failed to connect to database: ${err.stack}`)
        })

        this.init();
    }

    /**
     * @function connect
     * @description Establish a database connection.
     * @returns {Promise<void>}
     * @memberof Database
     * @instance IInstance
     */
    private async connect(): Promise<void> {
        if (Database.connection.readyState === 1) {
            return;
        }

        try {
            await this.instance.properties.mongoose.connect(Database.uri);
            this.instance.setLastUsed()
            this.instance.setState('HEALTHY');
            Database.logger.info(`Connected to database: ${Database.maskUri(Database.uri)}`);
            Database.logger.info(`Database Instance ID: ${this.instance.id}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                this.instance.setState('UNHEALTHY');
                Database.logger.error(`Database failed to connect to: ${Database.maskUri(Database.uri)}`);
                Database.logger.error(err.message);
            } else if (err instanceof CordXError) {
                throw new CordXError('FATAL_ERROR', 500, 'Database connection refused', err.stack);
            } else {
                throw new CordXError('FATAL_ERROR', 500, 'Database connection refused', err);
            }
        }
    }

    /**
     * @function init
     * @description Initialize the database connection.
     * @returns {void}
     * @memberof Database
     * @instance IInstance
     */
    private init(): void {
        Database.connection.on('error', (err: Error) => {
            this.instance.state = 'UNHEALTHY'
            Database.logger.error(err.message);
            this.instance.cleanup().catch((err: Error) => {
                Database.logger.error(`Failed to cleanup database instance.`)
                Database.logger.error(err.message);
            })
            this.instance.destroy().catch((err: Error) => {
                Database.logger.error(`Failed to destroy database instance.`)
                Database.logger.error(err.message);
            })
        });

        Database.connection.on('disconnected', () => {
            this.instance.state = 'DESTROYED';
            Database.logger.warn(`Disconnected from MongoDB at ${Database.maskUri(Database.uri)}`);
            this.instance.cleanup().catch((err: Error) => {
                Database.logger.error(`Failed to cleanup database instance.`)
                Database.logger.error(err.message);
            })
            this.instance.destroy().catch((err: Error) => {
                Database.logger.error(`Failed to destroy database instance.`)
                Database.logger.error(err.message);
            })
        })

        Database.connection.on('reconnected', () => {
            this.instance.state = 'HEALTHY';
            Database.logger.info(`Reconnected to MongoDB at ${Database.maskUri(Database.uri)}`);
        })
    }

    /**
     * @function maskUri
     * @description Mask the database uri.
     */
    private static maskUri(uri: string): string {
        return uri.replace(/\/\/.*?@.*?:/, '//<credentials>@<ip>:');
    }

    private disconnect(): void {
        if (Database.connection.readyState === 0) {
            return;
        }

        Database.connection.close();

        Database.logger.info(`Disconnected from MongoDB at ${Database.maskUri(Database.uri)}`);
    }

    public cleanup(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.instance.properties.mongoose.connection.close().then(() => {
                this.instance.logs?.success(`Successfully cleaned up database instance.`);
                resolve(true)
            }).catch((err: Error) => {
                this.instance.logs?.fatal(`Failed to cleanup database instance.`)
                reject(err.stack)
            })
        })
    }
}