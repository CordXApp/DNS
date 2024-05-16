import "dotenv/config";
import path from "node:path";
import { version } from '../../package.json';
import { Logger } from "../clients/other/log.client";
import fastifyClient, { FastifyInstance } from 'fastify';
import { Database } from "../prisma/prisma.client";

export class DNSServer {
    private logger: Logger;
    private app: FastifyInstance;

    constructor() {
        this.logger = new Logger('[SERVER]', false);
        this.app = fastifyClient({ logger: false });
    }

    public async start(): Promise<void> {
        this.app.register(require('@fastify/cors'), {
            origin: ['*'],
            allowedHeaders: ['Content-Type', 'Content-Disposition', 'Content-Length'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
            optionsSuccessStatus: 200,
            strictPreflight: true,
            preflight: true
        });

        /** REGISTER ALL ROUTES */
        this.app.register(require('@fastify/autoload'), {
            dir: path.join(__dirname, 'routes')
        })

        this.app.addHook("preHandler", (req, res, done) => {
            req.db = new Database();

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', '*');
            res.header('User-Agent', `CordX:DNS/${version}`);

            done();
        });

        this.app.setErrorHandler((err: any, req, res) => {
            this.logger.error(err.message);

            if (err.validation) return res.status(400).send({
                message: 'Bad Request',
                error: err.validation,
                code: 400
            })

            if (err.code === 500 || err.statusCode === 500) return res.status(500).send({
                status: 'INTERNAL_SERVER_ERROR',
                message: `${err.message}`,
                code: 500
            })
        })

        this.app.setNotFoundHandler((req, res) => {
            res.status(404).send({
                status: 'NOT_FOUND',
                message: 'The requested resource was unable to be found.',
                code: 404
            })
        })

        this.app.ready(err => {
            if (err) throw err;
        });

        try {
            this.app.listen({
                port: parseInt('10505'),
                host: '0.0.0.0'
            });

            this.logger.success(`Server is running on port 10505`);
        } catch (err: unknown) {

            if (err instanceof Error) {
                this.logger.error(`Error starting server: ${err.message}`);
                this.logger.debug(err.stack as string);
            }

            this.logger.error(`An unknown error occurred while starting the server.`);

            process.exit(1);
        }
    }
}

declare module "fastify" {
    export interface FastifyRequest {
        db: Database;
    }
}