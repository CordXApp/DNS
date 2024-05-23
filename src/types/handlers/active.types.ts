import { FastifyRequest, FastifyReply } from "fastify";
import { Request } from "../../types/fastify.types";

export interface ActiveDom {
    get: GetActiveDom;
    post: UpdateActiveDom;
}

export interface GetActiveDom {
    handler: (req: FastifyRequest<Request>, res: FastifyReply) => Promise<void>;
    validate: (req: FastifyRequest<Request>, res: FastifyReply) => Promise<void>;
}

export interface UpdateActiveDom {
    handler: (req: FastifyRequest<Request>, res: FastifyReply) => Promise<void>;
    validate: (req: FastifyRequest<Request>, res: FastifyReply) => Promise<void>;
}
