import { DomHandler } from "../../../../handlers/domain/handler";
import { DomainDocs } from "../../../../swagger/domain/dom.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { active } = new DomHandler();

  app.route({
    url: "/:user",
    method: "GET",
    handler: active.getHandler,
    preHandler: active.preHandler,
    schema: DomainDocs.GetActiveDomain,
  });

  app.route({
    url: "/:user",
    method: "POST",
    handler: active.postHandler,
    preHandler: active.postPreHandler,
    schema: DomainDocs.setActiveDomain,
  });
}
