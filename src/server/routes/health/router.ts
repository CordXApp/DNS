import { BaseHandler } from '../../handlers/base/handler';
import { FastifyInstance } from 'fastify';

export default async function (app: FastifyInstance) {

    const { health } = new BaseHandler();

    app.route({
        method: 'GET',
        url: '/',
        handler: health.handler
    })
}