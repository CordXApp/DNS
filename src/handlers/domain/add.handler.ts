import { FastifyRequest, FastifyReply } from "fastify";
import { Request } from "../../types/fastify.types";

export class BaseHandler {
    constructor() { }

    public get get() {
        return {
            handler: (req: FastifyRequest, res: FastifyReply) => {
                return res.status(400).send({
                    status: 'UNSUPPORTED_METHOD',
                    message: "Requests to this endpoint must be made using the POST method.",
                    code: 400,
                });
            },
        };
    }

    public get post() {
        return {
            handler: async (req: FastifyRequest<{ Params: Request['Params'], Querystring: Request['Querystring'] }>, res: FastifyReply) => {
                const { user } = req.params;
                const { domain } = req.query

                const userCheck = await req.db.user.exists(user as string);

                if (!userCheck) return res.status(404).send({
                    status: 'USER_NOT_FOUND',
                    message: 'Unable to locate your user data, please try again.',
                    code: 404,
                })

                const domCheck = await req.db.domain.exists({ domain: domain as string })

                if (domCheck) return res.status(409).send({
                    status: 'DOMAIN_EXISTS',
                    message: 'You already have a domain with that name.',
                    code: 409,
                });


            },
            validate: async (req: FastifyRequest<{ Params: Request['Params'], Querystring: Request['Querystring'] }>, res: FastifyReply) => {
                const { user } = req.params;
                const { domain, secret } = req.query;
                const userToCheck = await req.db.user.fetch(user as string);

                if (!user) return res.status(400).send({
                    status: 'USER_NOT_PROVIDED',
                    message: 'No user was provided in the request.',
                    code: 400,
                });

                if (!domain) return res.status(400).send({
                    status: 'DOMAIN_NOT_PROVIDED',
                    message: 'No domain was provided in the request.',
                    code: 400,
                });

                if (!secret) return res.status(400).send({
                    status: 'SECRET_NOT_PROVIDED',
                    message: 'No secret was provided in the request.',
                    code: 400,
                });

                if (!userToCheck.success) return res.status(404).send({
                    status: 'USER_NOT_FOUND',
                    message: 'Unable to locate your user data, please try again.',
                    code: 404,
                });

                if (userToCheck.data.secret !== secret) return res.status(401).send({
                    status: 'INVALID_SECRET',
                    message: 'The provided user secret is invalid, please check your credentials and try again.',
                    code: 401,
                });
            }
        };
    }
}