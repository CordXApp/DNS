import { ExpiredDomHandler } from "../../../../handlers/domain/expired.handler";
import { ExpiredDomDocs } from "../../../../swagger/domain/expired.docs";
import { Router } from "../../../../types/base.types";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
    const { get } = new ExpiredDomHandler();

    const Getter: Router = {
        url: '/',
        method: 'GET',
        handler: get.handler,
        preHandler: get.validate,
        schema: ExpiredDomDocs.schema,
    }

    app.route(Getter);
}
