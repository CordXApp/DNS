import { FastifyRequest, FastifyReply } from "fastify";
import PackageJSON from "../../../package.json";

export class BaseHandler {
  constructor() { }

  public get home() {
    return {
      handler: (req: FastifyRequest, res: FastifyReply) => {
        return res.status(200).send({
          message: "Welcome to the CordX DNS Server/API, please refer to the \`/docs\` end-point for more information!",
          version: `v${PackageJSON.version}`,
          discord: "https://cordx.lol/discord",
          code: 200,
        });
      },
    };
  }

  public get health() {
    return {
      handler: (req: FastifyRequest, res: FastifyReply) => {
        return res.status(200).send(
          JSON.stringify({
            name: PackageJSON.name,
            about: PackageJSON.description,
            version: PackageJSON.version,
            status: "OK",
            stats: {
              uptime: formatUptime(process.uptime()),
              memory: process.memoryUsage(),
              cpu: process.cpuUsage(),
            },
          }),
        );
      },
    };
  }
}

function formatUptime(uptime) {
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}
