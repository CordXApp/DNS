import { IInstance } from '../../types/instance';
import PackageJSON from '../../../package.json';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Keys } from '../../clients/database/key.client';
import { Database } from '../../clients/database/db.client';
import { InstanceClient } from '../../clients/instances/instance.client';

const Handler = async (req: FastifyRequest, res: FastifyReply) => {

    const array = InstanceClient.healthy();

    const instances: any = [];

    array.map((i: IInstance) => {
        return instances.push({
            id: i.id,
            name: i.name,
            state: i.state,
            created: i.createdAt,
            lastUsed: i.lastUsed
        })
    })

    return res.status(200).send(JSON.stringify({
        name: `${PackageJSON.name}`,
        about: `${PackageJSON.description}`,
        version: `${PackageJSON.version}`,
        status: 'OK',
        stats: {
            uptime: formatUptime(process.uptime()),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
        },
        clients: {
            database: {
                status: InstanceClient.exists('CordX:Database') ? 'HEALTHY' : 'UNHEALTHY',
                version: Database.version
            },
            instances: {
                status: InstanceClient.health(),
                version: InstanceClient.version,
                active: InstanceClient.count()
            },
            keys: {
                status: Keys.health(),
                version: Keys.version
            }
        },
        instances: {
            healthy: instances
        }
    }))
};

export const healthCheck = { Handler };

function formatUptime(uptime) {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
}