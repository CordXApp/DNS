import { BaseHandler } from "../../handlers/base/handler";
import { BaseDocs } from "../../swagger/base/health.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { health } = new BaseHandler();

  app.route({
    method: "GET",
    url: "/",
    handler: health.handler,
    schema: BaseDocs.ServerHealth,
  });
}
