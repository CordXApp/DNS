import { ViewDomHandler } from "../../../../handlers/domain/view.handler";
import { DomainDocs } from "../../../../swagger/domain/dom.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { get } = new ViewDomHandler();

  app.route({
    url: "/:domain",
    method: "GET",
    handler: get.handler,
    preHandler: get.validate,
    schema: DomainDocs.ViewDomain,
  });
}
