import { RouteSchema } from "../../../types/base.types"

export const ListDomainsSchema: RouteSchema = {
    tags: ['DNS'],
    summary: 'List all of a user\'s domains',
    description: 'List all of the domains that a user has registered with us.',
    security: [{ Bearer: [] }],
    response: {
        200: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                txtContent: { type: 'string' },
                verified: { type: 'boolean' },
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
        404: {
            type: 'object',
            properties: {
                status: { type: 'string' },
                message: { type: 'string' },
                code: { type: 'number' },
            }
        },
    },
}