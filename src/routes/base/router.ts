import { InstanceClient } from '../../clients/instances/instance.client';
import { IInstance } from '../../types/instance';
import { Router } from '../../types/interfaces';
import PackageJSON from '../../../package.json';
import { Database } from '../../clients/database/db.client';
import { Keys } from '../../clients/database/key.client';

const base: Router = {
    url: '/',
    method: 'GET',
    handler: (req: any, res: any) => {
        return res.status(200).send({
            discord: 'https://cordx.lol/discord',
            message: 'Hey there, do you know what you are doing here? If not, please leave.',
            code: 200
        })
    },
}

const check: Router = {
    url: '/health',
    method: 'GET',
    handler: async (req: any, res: any) => {

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
    }
}

export const BaseRoutes: any[] = [
    base,
    check
];

function formatUptime(uptime) {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
}