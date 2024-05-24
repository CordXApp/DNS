import { ActiveDomHandler } from "../../../../handlers/domain/active.handler";
import { ActiveDomDocs } from "../../../../swagger/domain/active.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { get, post } = new ActiveDomHandler();

  app.route({
    url: "/:user",
    method: "GET",
    handler: get.handler,
    preHandler: get.validate,
    schema: ActiveDomDocs.get,
  });

  app.route({
    url: "/:user",
    method: "POST",
    handler: post.handler,
    preHandler: post.validate,
    schema: ActiveDomDocs.post,
  });
}
