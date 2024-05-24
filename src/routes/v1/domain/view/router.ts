import { ViewDomHandler } from "../../../../handlers/domain/view.handler";
import { ViewDomDocs } from "../../../../swagger/domain/view.docs";
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  const { get } = new ViewDomHandler();
  const { schema } = ViewDomDocs;

  app.route({
    url: "/:domain",
    method: "GET",
    handler: get.handler,
    preHandler: get.validate,
    schema: schema,
  });
}
