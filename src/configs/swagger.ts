import { version } from '../../package.json';

export const swaggerOptions = {
    routePrefix: '/docs',
    exposeRoute: true,
    hideUntagged: true,
    swagger: {
        host: 'dns.cordx.lol',
        basePath: '/',
        schemes: ['https', 'http'],
        consumes: ['*/*'],
        produces: ['*/*'],
        info: {
            title: 'CordX DNS',
            description: 'Documentation for our Domain Name System (DNS) API.',
            version: version
        },
        tags: [
            { name: 'DNS', description: 'DNS related end-points.', },
            { name: 'Auth', description: 'Authentication related end-points.' }
        ],
        definitions: {
            apiKey: {
                type: 'object',
                required: ['key', 'admin'],
                properties: {
                    key: { type: 'string' },
                    admin: { type: 'boolean' },
                    createdAt: { type: 'string' }
                }
            },
            domain: {
                type: 'object',
                required: ['domain', 'ip'],
                properties: {
                    name: { type: 'string' },
                    txtContent: { type: 'string' },
                    verified: { type: 'boolean' }
                }
            },
            user: {
                type: 'object',
                required: ['id', 'username', 'avatar'],
                properties: {
                    id: { type: 'string' },
                    owner: { type: 'boolean' },
                    admin: { type: 'boolean' },
                    moderator: { type: 'boolean' },
                    banned: { type: 'boolean' },
                    verified: { type: 'boolean' },
                    beta: { type: 'boolean' },
                    active_domain: { type: 'string' },
                    domains: { type: 'array', items: { $ref: '#/definitions/domain' } },
                }
            },
        },
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'Bearer token for authentication purposes.',
            }
        }
    },
    uiConf: { docExpansion: 'full', deepLinking: false },
    uiHooks: {
        onRequest: function (req: any, reply: any, next: any) { next() },
        preHandler: function (req: any, reply: any, next: any) { next() }
    }
}