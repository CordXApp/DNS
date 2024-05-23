import { DomHandler } from "../../../../handlers/domain/view.handler";
import { DomainDocs } from "../../../../swagger/domain/dom.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { active } = new DomHandler();

  app.route({
    url: "/:user",
    method: "GET",
    handler: active.getHandler,
    preHandler: active.getPreHandler,
    schema: DomainDocs.GetActiveDomain,
  });

  app.route({
    url: "/:user",
    method: "POST",
    handler: active.setHandler,
    preHandler: active.setPreHandler,
    schema: DomainDocs.setActiveDomain,
  });
}
