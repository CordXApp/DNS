import { ViewDomHandler } from "../../../../handlers/domain/view.handler";
import { ViewDomDocs } from "../../../../swagger/domain/view.docs";
import { Router } from "../../../../types/base.types";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { get } = new ViewDomHandler();
  const { schema } = ViewDomDocs;

  const Getter: Router = {
    url: '/',
    method: 'GET',
    handler: get.handler,
    preHandler: get.validate,
    schema: schema,
  }

  app.route(Getter);
}
