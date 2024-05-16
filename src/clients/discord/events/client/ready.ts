import { ActivityType } from 'discord.js';
import { Event } from '../../schemas/event.schema';
import type DNSClient from '../../dns.client';

export default class Ready extends Event {
    constructor() {
        super({ name: 'ready', once: true });
    }

    public async exec(client: DNSClient): Promise<void> {
        client.logs.success(`logged in as ${client.user?.tag}`);

        await client.server.start().catch((err: Error) => {
            client.logs.error(`error starting the server: ${err.message}`);
            client.logs.debug(err.stack as string);
            process.exit(1);
        });

        client.user?.setStatus('dnd');
        const stats = await client.db.domain_stats.total();

        client.user?.setActivity({
            name: `${stats} custom domains`,
            type: ActivityType.Watching
        })
    }
}