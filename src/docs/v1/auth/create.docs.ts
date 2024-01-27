import { RouteSchema } from "../../../types/interfaces"

export const CreateKeySchema: RouteSchema = {
    tags: ['Auth'],
    summary: 'Create a new hash key',
    description: 'Create a new hash key and register it in our database for authentication purposes.',
    security: [{ Bearer: [] }],
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                code: { type: 'number' },
                key: { type: 'string' },
            }
        },
        400: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                message: { type: 'string' },
                code: { type: 'number' },
            }
        },
        401: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                message: { type: 'string' },
                code: { type: 'number' },
            }
        },
        418: {
            type: 'object',
            properties: {
                tea: { type: 'string' },
                message: { type: 'string' },
                code: { type: 'number' },
            }
        },
        423: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                message: { type: 'string' },
                code: { type: 'number' },
            }
        },
    },
}