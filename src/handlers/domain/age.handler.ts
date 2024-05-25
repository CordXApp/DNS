import { FastifyRequest, FastifyReply } from "fastify";
import { Request } from "../../types/fastify.types";

export class DomAgeHandler {
    constructor() { }

    public get get() {
        return {
            handler: async (req: FastifyRequest<{ Querystring: Request['Querystring'] }>, res: FastifyReply) => {
                const { domain } = req.query;

                const dom = await req.db.domain.age({ domain });

                if (!dom.success) return res.status(500).send({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: dom.message,
                    code: 500,
                });

                return res.status(200).send({
                    domain: domain,
                    age: `${dom.data.age} days`
                })
            },
            validate: async (req: FastifyRequest<{ Querystring: Request['Querystring'] }>, res: FastifyReply) => {

                const { domain } = req.query;

                if (!domain) return res.status(400).send({
                    status: 'DOMAIN_NOT_PROVIDED',
                    message: 'No domain was provided in the request.',
                    code: 400,
                });

                const exists = await req.db.domain.exists({ domain });

                if (!exists) return res.status(404).send({
                    status: 'DOMAIN_NOT_FOUND',
                    message: 'The provided domain does not exist in the database.',
                    code: 404,
                });
            }
        };
    }
}