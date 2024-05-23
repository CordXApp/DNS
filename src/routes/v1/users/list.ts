import { Router } from "../../../types/base.types";
import { UserHandler } from "../../../handlers/users/handler";
import { UserDocs } from "../../../swagger/users/list.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { list } = new UserHandler();

  const route: Router = {
    url: "/:user/domains",
    method: "GET",
    handler: list.handler,
    preHandler: list.preHandler,
    schema: UserDocs.ListDomains,
  };

  app.route(route);
}
