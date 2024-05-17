import { RouteSchema } from "../../../types/base.types";

export class BaseDocs {
    constructor() { }

    public static ServerHealth: RouteSchema = {
        tags: ['Root'],
        summary: 'Check the health of the server',
        description: 'Check the health of the server',
        response: {
            200: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    about: { type: 'string' },
                    version: { type: 'string' },
                    status: { type: 'string' },
                    stats: {
                        type: 'object',
                        properties: {
                            uptime: { type: 'string' },
                            memory: { type: 'object' },
                            cpu: { type: 'object' }
                        }
                    }
                }
            }
        }
    }
}