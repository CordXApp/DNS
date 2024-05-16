import { FastifyRequest, FastifyReply } from "fastify";
import { Params } from "../../../types/fastify.types";
import { ViewHandler } from "../../../types/handlers/view.types";

export class DomHandler {
    constructor() { }

    /**
     * @description Handler for viewing a domain
     * @returns {object} - Fastify handler object
     * @example
     * const handler = new DomHandler();
     * fastify.get('/domain/:domain', handler.view);
     */
    public get view(): ViewHandler {
        return {
            handler: async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply): Promise<void> => {

                const { domain } = req.params;

                const dom = await req.db.domain.fetch({ domain: domain as string });

                if (!dom.success) return res.status(500).send({
                    status: 'DOMAIN_ERROR',
                    message: dom.message,
                    code: 500
                })

                return res.status(200).send(JSON.stringify(dom.data));
            },
            preHandler: async (req: FastifyRequest<{ Params: Params }>, res: FastifyReply): Promise<void> => {

                const { domain } = req.params;

                if (!domain) return res.status(400).send({
                    status: 'NO_DOMAIN_PROVIDED',
                    message: 'Please provide a domain to view in the request params',
                    code: 400
                })

                const exists = await req.db.domain.exists({ domain });

                if (!exists) return res.status(404).send({
                    status: 'DOMAIN_NOT_FOUND',
                    message: 'The domain you are trying to view does not exist',
                    code: 404
                })
            }
        }
    }
}