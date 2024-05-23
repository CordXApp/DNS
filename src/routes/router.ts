import { BaseHandler } from "../handlers/base/handler";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { home } = new BaseHandler();

  app.route({
    url: "/",
    method: "GET",
    handler: home.handler,
  });
}
