import "dotenv/config";
import path from "node:path";
import { version } from "../package.json";
import { Logger } from "./clients/log.client";
import fastifyClient, { FastifyInstance } from "fastify";
import { Database } from "./prisma/prisma.client";

export class DNSServer {
  private logger: Logger;
  private app: FastifyInstance;

  constructor() {
    this.logger = new Logger("[SERVER]", false);
    this.app = fastifyClient({ logger: false });
  }

  public async start(): Promise<void> {
    this.app.register(require("@fastify/cors"), {
      origin: ["*"],
      allowedHeaders: ["Content-Type", "Content-Disposition", "Content-Length"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      optionsSuccessStatus: 200,
      strictPreflight: true,
      preflight: true,
    });

    this.app.register(require("@fastify/swagger"), {
      routePrefix: "/docs",
      exposeRoute: true,
      hideUntagged: true,
      swagger: {
        host: "dns.cordx.lol",
        basePath: "/",
        schemes: ["https", "http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        info: {
          title: "CordX DNS",
          description: "Open-Source DNS Server for the CordX DNS System",
          version: version,
        },
        tags: [
          { name: "Root", description: "Root server end-points" },
          { name: "DNS", description: "Base DNS end-points" },
          { name: "Users", description: "User DNS end-points" }
        ],
      },
      uiConf: { docExpansion: "full", deepLinking: false },
      uiHooks: {
        onRequest: function (req: any, reply: any, next: any) {
          next();
        },
        preHandler: function (req: any, reply: any, next: any) {
          next();
        },
      },
    });

    /** REGISTER ALL ROUTES */
    this.app.register(require("@fastify/autoload"), {
      dir: path.join(__dirname, "routes"),
    });

    this.app.addHook("preHandler", (req, res, done) => {
      req.db = new Database();

      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
      );
      res.header("Access-Control-Allow-Headers", "*");
      res.header("User-Agent", `CordX:DNS/${version}`);

      done();
    });

    this.app.setNotFoundHandler((req, res) => {
      res.status(404).send({
        status: "NOT_FOUND",
        message: "The requested resource was unable to be found.",
        code: 404,
      });
    });

    this.app.ready((err) => {
      if (err) throw err;
      this.app.swagger();
    });

    try {
      this.app.listen({
        port: parseInt("10505"),
        host: "0.0.0.0",
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
  export interface FastifyInstance {
    swagger: () => void;
  }
}

declare module "fastify" {
  export interface FastifyRequest {
    db: Database;
  }
}
