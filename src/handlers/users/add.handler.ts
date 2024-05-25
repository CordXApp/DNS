import { FastifyRequest, FastifyReply } from "fastify";
import { Request } from "../../types/fastify.types";

export class AddDomHandler {
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
            handler: async (req: FastifyRequest<{ Body: Request['Body'] }>, res: FastifyReply) => {
                const { user, domain } = req.body;

                const create = await req.db.domain.create({
                    owner: user,
                    domain: domain
                })

                if (!create.success) return res.status(500).send({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: `Error: ${create.message}`,
                    code: 500,
                });

                return res.status(201).send({
                    status: 'DOMAIN_CREATED',
                    message: 'Your domain has been successfully created.',
                    data: create.data
                })
            },
            validate: async (req: FastifyRequest<{ Body: Request['Body'] }>, res: FastifyReply) => {
                const { user, domain, secret } = req.body;

                const userToCheck = await req.db.user.fetch(user as string);
                const domCheck = await req.db.domain.exists({ domain: domain as string })
                const validate = await req.db.domain.validate({ domain: domain as string });

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

                if (!validate.success) return res.status(400).send({
                    status: 'INVALID_DOMAIN',
                    message: validate.message,
                    code: 400,
                });

                if (!userToCheck.success) return res.status(404).send({
                    status: 'USER_NOT_FOUND',
                    message: 'Unable to locate your user data, please try again.',
                    code: 404,
                });

                if (userToCheck.data.secret !== secret) return res.status(401).send({
                    status: 'INVALID_SECRET',
                    message: 'Unable to validate user secret, please try again.',
                    code: 401,
                });

                if (domCheck) return res.status(404).send({
                    status: 'DOMAIN_NOT_FOUND',
                    message: 'You already have a domain with this name!',
                    code: 404,
                });
            }
        };
    }
}