import { DomHandler } from "../../../../handlers/domain/view.handler";
import { DomainDocs } from "../../../../swagger/domain/dom.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { view } = new DomHandler();

  app.route({
    url: "/:domain",
    method: "GET",
    handler: view.handler,
    preHandler: view.preHandler,
    schema: DomainDocs.ViewDomain,
  });
}
