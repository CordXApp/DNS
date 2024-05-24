import { Router } from "../../../types/base.types";
import { ListUserDomsHandler } from "../../../handlers/users/list.handler";
import { ListUserDomsDocs } from "../../../swagger/users/list.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { get } = new ListUserDomsHandler();
  const { schema } = ListUserDomsDocs;

  const route: Router = {
    url: "/:user/domains",
    method: "GET",
    handler: get.handler,
    preHandler: get.validate,
    schema: schema,
  };

  app.route(route);
}
