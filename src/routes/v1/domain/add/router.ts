import { AddDomHandler } from "../../../../handlers/domain/add.handler";
import { AddDomDocs } from "../../../../swagger/domain/add.docs";
import { Router } from "../../../../types/base.types";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
    const { get, post } = new AddDomHandler();
    const { schema } = AddDomDocs;

    const Getter: Router = {
        url: '/',
        method: 'GET',
        handler: get.handler
    }

    const Poster: Router = {
        url: '/',
        method: 'POST',
        handler: post.handler,
        preHandler: post.validate,
        schema: schema,
    }

    app.route(Getter);
    app.route(Poster);
}