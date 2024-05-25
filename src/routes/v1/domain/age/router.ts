import { DomAgeHandler } from "../../../../handlers/domain/age.handler";
import { DomAgeDocs } from "../../../../swagger/domain/age.docs";
import { Router } from "../../../../types/base.types";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
    const { get } = new DomAgeHandler();

    const Getter: Router = {
        url: '/',
        method: 'GET',
        handler: get.handler,
        preHandler: get.validate,
        schema: DomAgeDocs.schema,
    }

    app.route(Getter);
}
