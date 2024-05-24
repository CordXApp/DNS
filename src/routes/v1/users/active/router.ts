import { ActiveDomHandler } from "../../../../handlers/users/active.handler";
import { ActiveDomDocs } from "../../../../swagger/users/active.docs";
import { Router } from "../../../../types/base.types";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { get, post } = new ActiveDomHandler();

  const Getter: Router = {
    url: "/:user",
    method: "GET",
    handler: get.handler,
    preHandler: get.validate,
    schema: ActiveDomDocs.get,
  };

  const Poster: Router = {
    url: "/:user",
    method: "POST",
    handler: post.handler,
    preHandler: post.validate,
    schema: ActiveDomDocs.post,
  };

  app.route(Getter);
  app.route(Poster);
}
