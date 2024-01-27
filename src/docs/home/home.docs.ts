import { RouteSchema } from "../../types/interfaces"

export const HomeSchema: RouteSchema = {
    tags: [],
    summary: 'Main API route.',
    description: 'Kinda useless, but it\'s here.',
    response: {
        200: {
            type: 'object',
            properties: {
                discord: { type: 'string' },
                message: { type: 'string' },
                code: { type: 'number' },
            }
        },
    },
}