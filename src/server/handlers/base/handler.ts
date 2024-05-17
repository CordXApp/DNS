import { FastifyRequest, FastifyReply } from "fastify";
import PackageJSON from '../../../../package.json';

export class BaseHandler {
    constructor() { }

    public get home() {
        return {
            handler: (req: FastifyRequest, res: FastifyReply) => {
                return res.status(200).send({
                    status: 'OK',
                    message: 'Hey there, do you know what you are doing here?',
                    discord: 'https://cordx.lol/discord',
                    code: 200
                })
            }
        }
    }

    public get health() {
        return {
            handler: (req: FastifyRequest, res: FastifyReply) => {
                return res.status(200).send(JSON.stringify({
                    name: PackageJSON.name,
                    about: PackageJSON.description,
                    version: PackageJSON.version,
                    status: 'OK',
                    stats: {
                        uptime: formatUptime(process.uptime()),
                        memory: process.memoryUsage(),
                        cpu: process.cpuUsage(),
                    }
                }))
            }
        }
    }
}

function formatUptime(uptime) {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
}