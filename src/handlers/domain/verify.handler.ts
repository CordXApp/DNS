import { FastifyRequest, FastifyReply } from "fastify";
import { Request } from "../../types/fastify.types";
import { BLACKLIST_CONFIG } from "../../types/base.types";

export class VerifyDomHandler {
    constructor() { }

    public get get() {
        return {
            handler: async (req: FastifyRequest<{ Querystring: Request['Querystring'] }>, res: FastifyReply) => {
                const { domain } = req.query;

                if (!domain) return res.status(400).send({
                    status: 'INVALID_DOMAIN',
                    message: 'Please provide a domain to verify in the querystring!',
                    code: 400
                });

                const validate = await req.db.domain.validate({ domain });

                if (!validate.success) return res.status(400).send({
                    status: 'INVALID_DOMAIN',
                    message: validate.message,
                    code: 400
                });

                const records = await req.db.domain.verified({ domain });

                if (!records!.success) return res.status(400).send({
                    status: 'DOMAIN_VERIFICATION_FAILED',
                    message: records!.message,
                    code: 400
                });

                return res.status(200).send({
                    status: 'SUCCESS',
                    message: 'Domain ownership verified!',
                    code: 200
                });
            },
            validate: async (req: FastifyRequest<{ Querystring: Request['Querystring'] }>, res: FastifyReply) => {

                const { domain } = req.query;
                const isBlacklisted = await req.db.domain.blacklisted({ domain, config: BLACKLIST_CONFIG });
                const doesExist = await req.db.domain.exists({ domain });


                if (!domain) return res.status(400).send({
                    status: 'INVALID_DOMAIN',
                    message: 'Please provide a domain to verify in the querystring!',
                    code: 400
                });

                if (!doesExist) return res.status(400).send({
                    status: 'INVALID_DOMAIN',
                    message: 'Whoops, the provided domain does not exist in our database!',
                    code: 400
                });

                if (isBlacklisted) {

                    await req.db.domain.delete({ domain });

                    return res.status(400).send({
                        status: 'INVALID_DOMAIN',
                        message: 'Whoops, looks like this domain has been blacklisted!',
                        code: 400
                    });
                }
            }
        };
    }
}