import { FastifyRequest, FastifyReply } from 'fastify';
import { createTeaPotError } from '../../../res/errors';
import { Request } from '../../../types/fastify.types';
import { Responses } from '../../../types/clients/key.types';

const Handler = async (req: FastifyRequest<Request>, res: FastifyReply) => {
    res.header('Content-Type', 'application/json');

    const db = req.db;
    const domain = req.query.domain;
    const data = await db.dns.fetch(domain ? domain : '');

    if (!data.success) return res.status(400).send({
        status: 'DOMAIN_NOT_FOUND',
        message: 'The domain you are looking for does not exist.',
        code: 400
    })

    return res.status(200).send({
        name: data?.domain?.name,
        txtContent: data?.domain?.txtContent,
        verified: data?.domain?.verified,
    })
};

const PreHandler = async (req: FastifyRequest<Request>, res: FastifyReply) => {
    res.header('Content-Type', 'application/json');

    const db = req.db;
    const auth = req.headers['authorization'];
    const domain = req.query.domain;

    console.log(domain)

    if (!req.params || !domain) return res.status(400).send({
        status: 'INVALID_REQ_PARAMS',
        message: createTeaPotError(),
        code: 400
    });

    if (!auth) return res.status(401).send({
        status: 'MISSING_AUTHORIZATION_HEADER',
        message: createTeaPotError(),
        code: 401
    });

    const responses: Responses = await db.keys.instance.properties.validate(auth, 'BASIC');
    const check = responses.validate

    if (!check.success) return res.status(check.code as number).send({
        status: check.status,
        message: check.message,
        code: check.code
    });
};

export const View = { PreHandler, Handler };