import { VerifyDomHandler } from "../../../../handlers/domain/verify.handler";
import { VerifyDomDocs } from "../../../../swagger/domain/verify.docs";
import { Router } from "../../../../types/base.types";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
    const { get } = new VerifyDomHandler();

    const Getter: Router = {
        url: '/',
        method: 'GET',
        handler: get.handler,
        preHandler: get.validate,
        schema: VerifyDomDocs.schema,
    }

    app.route(Getter);
}
