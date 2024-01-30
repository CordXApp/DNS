import { Database } from '../../../clients/database/db.client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { InstanceClient } from '../../../clients/instances/instance.client';

const Handler = async (req: FastifyRequest<{ Body: { domain: string } }>, res: FastifyReply) => {
    res.header('Content-Type', 'application/json');

    const domain = req.body.domain;

    //@ts-ignore
    const data = await req?.db?.getDomain(domain);

    if (!data.success) return res.status(400).send({
        message: 'Failed to get domain.',
        error: data.message,
        code: 400
    })

    const domainDocument = data.domain;

    if (!domainDocument) return res.status(404).send({
        message: 'Domain not found.',
        code: 404
    })

    return res.status(200).send({
        name: domainDocument.name,
        txtContent: domainDocument.txtContent,
        verified: domainDocument.verified,
    })
};

const PreHandler = async (req: FastifyRequest<{ Body: { domain: string }, Headers: { Authorization: string, } }>, res: FastifyReply) => {
    const db = req.db;
    const auth = req.headers['authorization'];
    const key = await db.keys.validate(auth.replace('Bearer ', ''))
    const dom = await req.body.domain;

    if (!dom || !req.body) return res.status(400).send({
        message: 'No domain provided.',
        code: 400
    });

    if (!auth) return res.status(401).send({
        message: 'No authorization header provided.',
        code: 401
    })

    if (!key.success) return res.status(400).send({
        message: 'Invalid authorization header.',
        error: key.message,
        code: 400
    })
};

export const View = { PreHandler, Handler };