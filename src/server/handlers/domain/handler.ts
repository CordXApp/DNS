import { FastifyRequest, FastifyReply } from "fastify";
import { Params, Request } from "../../../types/fastify.types";
import { ViewHandler } from "../../../types/handlers/view.types";

export class DomHandler {
  constructor() {}

  /**
   * @description Handler for viewing a domain
   * @returns {object} - Fastify handler object
   * @example
   * const handler = new DomHandler();
   * fastify.get('/domain/:domain', handler.view);
   */
  public get view(): ViewHandler {
    return {
      handler: async (
        req: FastifyRequest<{ Params: Params }>,
        res: FastifyReply,
      ): Promise<void> => {
        const { domain } = req.params;

        const dom = await req.db.domain.fetch({ domain: domain as string });

        if (!dom.success)
          return res.status(500).send({
            status: "DOMAIN_ERROR",
            message: dom.message,
            code: 500,
          });

        return res.status(200).send(JSON.stringify(dom.data));
      },
      preHandler: async (
        req: FastifyRequest<{ Params: Params }>,
        res: FastifyReply,
      ): Promise<void> => {
        const { domain } = req.params;

        if (!domain)
          return res.status(400).send({
            status: "NO_DOMAIN_PROVIDED",
            message: "Please provide a domain to view in the request params",
            code: 400,
          });

        const exists = await req.db.domain.exists({ domain });

        if (!exists)
          return res.status(404).send({
            status: "DOMAIN_NOT_FOUND",
            message: "The domain you are trying to view does not exist",
            code: 404,
          });
      },
    };
  }

  public get active(): any {
    return {
      getHandler: async (
        req: FastifyRequest<Request>,
        res: FastifyReply,
      ): Promise<void> => {
        const { user } = req.params;

        const active = await req.db.user.fetch(user as string);

        if (!active.success)
          return res.status(500).send({
            status: "ERROR_FETCHING_DOMAIN",
            message: active.message,
            code: 500,
          });

        return res.status(200).send({
          status: "OK",
          message: "Here is the users active domain",
          data: active.data.domain,
        });
      },
      getPreHandler: async (
        req: FastifyRequest<Request>,
        res: FastifyReply,
      ): Promise<void> => {
        const { user } = req.params;

        if (!user)
          return res.status(400).send({
            status: "NO_USER_PROVIDED",
            message: "Please provide a user to view the active domain for",
            code: 400,
          });

        if (!(await req.db.user.exists(user)))
          return res.status(404).send({
            status: "USER_NOT_FOUND",
            message:
              "The user you are trying to view the active domain for does not exist",
            code: 404,
          });
      },
      setHandler: async (
        req: FastifyRequest<Request>,
        res: FastifyReply,
      ): Promise<void> => {
        const { user, domain } = req.body;

        const active = await req.db.domain.setActive({ owner: user, domain });

        if (!active.success)
          return res.status(500).send({
            status: "DOMAIN_ACTIVATION_ERROR",
            message: active.message,
            code: 500,
          });

        return res.status(200).send({
          status: "OK",
          message: "Domain activated successfully",
        });
      },
      setPreHandler: async (
        req: FastifyRequest<Request>,
        res: FastifyReply,
      ): Promise<void> => {
        const { user } = req.params;
        const { domain, secret } = req.body;

        if (!user)
          return res.status(400).send({
            status: "NO_USER_PROVIDED",
            message: "Please provide a user to activate the domain for",
            code: 400,
          });

        if (!validateRequestBody)
          return res.status(400).send({
            status: "INVALID_REQUEST_BODY",
            message:
              "Please provide a valid request body with the domain and secret fields",
            code: 400,
          });

        if (!(await req.db.user.exists(user as string)))
          return res.status(404).send({
            status: "USER_NOT_FOUND",
            message:
              "The user you are trying to activate the domain for does not exist",
            code: 404,
          });

        if (!(await req.db.secret.exists(secret)))
          return res.status(401).send({
            status: "INVALID_SECRET",
            message: "The secret you provided is invalid",
            code: 401,
          });

        if (!(await req.db.domain.exists({ domain })))
          return res.status(404).send({
            status: "DOMAIN_NOT_FOUND",
            message: "The domain you are trying to activate does not exist",
            code: 404,
          });

        if (!(await req.db.domain.verifyRecord({ domain })))
          return res.status(401).send({
            status: "DOMAIN_NOT_VERIFIED",
            message:
              "The domain you are trying to activate has not been verified",
            code: 401,
          });

        const valid = await req.db.domain.validate({ domain });

        if (!valid.success)
          return res.status(500).send({
            status: "DOMAIN_VALIDATION_ERROR",
            message: valid.message,
            code: 500,
          });
      },
    };
  }
}

function validateRequestBody(
  body: Request["Body"] | undefined,
): body is Request["Body"] {
  return (
    body !== undefined &&
    typeof body.domain === "string" &&
    body.domain.trim() !== "" &&
    typeof body.secret === "string" &&
    body.secret.trim() !== ""
  );
}
