import { FastifyReply as OriginalFastifyReply } from 'fastify';

export interface CordXResponse extends OriginalFastifyReply {
    customResponse: (statusCode: number, body: {
        status: string;
        message: string;
        code: number;
    }) => CordXResponse;
}

export type CordXResponseType = new (reply: OriginalFastifyReply) => CordXResponse;

export interface Query {
    domain: string;
}

export interface Params {
    domain: string;
}

export interface Request {
    Querystring: Query;
    Params: Params;
    Headers: {
        Authorization: string;
    }
}