import "dotenv/config";
import fastifyCors from '@fastify/cors';
import { RateLimitConfig } from "./configs/420";
import { swaggerOptions } from "./configs/swagger";
import { Logger } from "./clients/other/log.client";
import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import { version } from '../package.json';
import { CorsOptions } from "./configs/cors";
const customHealthCheck = require('fastify-custom-healthcheck');
import fastifyClient, { FastifyInstance } from 'fastify';
import { UnderPressureStats } from "./types/up.types";
import { UnderPressureConfig } from "./configs/up";
import { Database } from "./clients/database/db.client";
import { InstanceClient } from "./clients/instances/instance.client";
import { Keys } from './clients/database/key.client';
import routes from './routes/router';

(async () => {

    const logs = await Logger.getInstance('Server', false);
    const fastify: FastifyInstance = fastifyClient({ logger: true });

    fastify.register(fastifyCompress);
    fastify.register(fastifyCors, CorsOptions)
    fastify.register(fastifyHelmet, { global: true });
    fastify.register(require('@fastify/rate-limit'), RateLimitConfig);
    await fastify.register(require('@fastify/swagger'), swaggerOptions);
    fastify.register(require('@fastify/under-pressure'), UnderPressureConfig);
    fastify.register(customHealthCheck, {
        info: {
            app: 'CordX DNS',
            status: 'OK',
            version: version,
            description: 'CordX DNS API',
            env: process.env.NODE_ENV,
            uptime: formatUptime(process.uptime()),
            clients: {
                database: {
                    status: InstanceClient.exists('CordX:Database') ? 'HEALTHY' : 'UNHEALTHY',
                    version: Database.version
                },
                instances: {
                    status: InstanceClient.health(),
                    version: InstanceClient.version
                },
                keys: {
                    status: InstanceClient.exists('CordX:KeyManager') ? 'HEALTHY' : 'UNHEALTHY',
                    version: Keys.version
                }
            }
        }
    });

    //routes.forEach((route: any) => fastify.route(route));

    fastify.addHook('preHandler', async (req, res): Promise<void> => {
        try {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('User-Agent', `CordX:DNS/${version}`);

            req.db = new Database();

        } catch (err: any) {
            console.log(err.stack)
        }
    })

    fastify.setErrorHandler(function (err: any, req: any, res: any): void {
        logs.error(err.message);

        if (err.validation) {
            res.status(400).send({
                message: 'Bad Request',
                errors: err.validation,
                code: 400
            })
        }

        if (err.code === 500 || err.statusCode === 500) {
            res.status(500).send({
                message: err.message,
                code: 500
            })
        }
    })

    fastify.setNotFoundHandler(function (req: any, res: any): void {
        res.status(404).send({
            message: 'Hmm, this page doesn\'t exist... Are you sure you\'re in the right place?',
            code: 404
        })
    });

    await fastify.ready((err) => {
        if (err) throw err;
        fastify.swagger();
    });

    const start = async (): Promise<void> => {
        try {

            await InstanceClient.cleanse().then((i: any) => {
                logs.info(JSON.stringify({
                    state: i.status,
                    message: i.details.message,
                    info: 'Server startup will continue now.'
                }));
            }).catch((err: any) => {
                logs.fatal(JSON.stringify({
                    state: err.state,
                    code: err.code,
                    message: err.details.message,
                    info: 'Server startup will not continue.'
                }));

                return process.exit(1);
            });

            await fastify.listen({
                host: '0.0.0.0',
                port: parseInt('10505')
            })

        } catch (err: any) {
            logs.error(err.stack)
            process.exit(1)
        }
    }

    start();
})();

/**
 * DEFINE CUSTOM FASTIFY INSTANCES TO ALLOW
 * CUSTOM PROPERTIES TO BE USED IN THE APPLICATION
 */
declare module 'fastify' {
    export interface FastifyInstance {
        addHealthCheck: (name: string, check: () => Promise<any>) => void;
        underPressure: () => UnderPressureStats;
        isUnderPressure(): boolean;
        swagger: () => void;
    }
}

declare module 'fastify' {
    export interface FastifyRequest {
        db: Database;
    }
}

function formatUptime(uptime) {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
}