import { BaseHandler } from "../handlers/base/handler";
import { BaseDocs } from "../swagger/base/health.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { home, health } = new BaseHandler();

  app.route({
    url: "/",
    method: "GET",
    handler: home.handler,
  });

  app.route({
    method: "GET",
    url: "/health",
    handler: health.handler,
    schema: BaseDocs.ServerHealth,
  });
}
