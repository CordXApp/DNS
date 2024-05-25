import { FastifyRequest, FastifyReply } from "fastify";
import { Request } from "../../types/fastify.types";

export class ExpiredDomHandler {
    constructor() { }

    public get get() {
        return {
            handler: async (req: FastifyRequest<{ Querystring: Request['Querystring'] }>, res: FastifyReply) => {
                const { domain } = req.query;

                const check = await req.db.domain.expired({ domain });
                const bruhhh = check ? 'Note: this domain is expired and has been removed from the database.' : 'Note: domains will be expired/deleted if not verified within 30 days of creation.';

                return res.status(200).send({
                    message: bruhhh,
                    domain: domain,
                    expired: check
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