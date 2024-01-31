import { RouteSchema } from "../../../types/base.types"

export const ViewDomainSchema: RouteSchema = {
    tags: ['DNS'],
    summary: 'View domain information',
    description: 'View the information we are storing about a domain.',
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
                message: { type: 'string' },
                code: { type: 'number' },
            }
        },
    },
}