import { FastifyRequest, FastifyReply } from "fastify";
import { Params } from "../../types/fastify.types";

export class ListUserDomsHandler {
  constructor() { }

  public get get() {
    return {
      handler: async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply): Promise<void> => {
        const { user } = req.params;

        const domains = await req.db.domain.list({ owner: user });

        return res.status(200).send(JSON.stringify(domains.data));
      },
      validate: async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply): Promise<void> => {
        const { user } = req.params;

        if (!user)
          return res.status(400).send({
            status: "NO_USER_PROVIDED",
            message: "Please provide a user to view in the request params",
            code: 400,
          });

        if (!(await req.db.user.exists(user)))
          return res.status(404).send({
            status: "USER_NOT_FOUND",
            message: "The user you are trying to view does not exist",
            code: 404,
          });

        const domains = await req.db.domain.list({ owner: user });

        if (!domains.success)
          return res.status(500).send({
            status: "INTERNAL_SERVER_ERROR",
            message: domains.message,
            code: 500,
          });
      }
    };
  }
}
