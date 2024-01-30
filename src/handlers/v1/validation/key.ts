import { Database } from '../../../clients/database/db.client';
import { FastifyRequest, FastifyReply } from 'fastify';
import { InstanceClient } from '../../../clients/instances/instance.client';
import { createKeyError, createTeaPotError } from '../../../res/errors';
import PackageJSON from '../../../../package.json'

/**
 * @function Handler the route handler for key validation.
 * @description Checks if the provided key is a valid api key,
 * if it is it will return the document, including the admin status.
 */
const Handler = async (req: FastifyRequest<{ Body: { key: string } }>, res: FastifyReply) => {
    const { key } = req.body

    const keyDoc = await req.db.keys.model.findOne({ key });

    if (!keyDoc) return res.status(404).send({
        status: 'KEY_NOT_FOUND',
        message: createKeyError(),
        code: 404
    });

    return res.status(200).send({
        key: keyDoc.key,
        createdAt: keyDoc.createdAt,
        lastUsedAt: keyDoc.lastUsed,
        version: keyDoc.version,
        status: keyDoc.version === PackageJSON.version ? 'Key is up-to date' : 'Key is outdated',
        level: keyDoc.admin ? 'ADMINISTRATOR' : 'BASIC'
    })
};

const PreHandler = async (req: FastifyRequest<{ Body: { key: string } }>, res: FastifyReply) => {
    const { key } = req.body
    const check = InstanceClient.exists('CordX:Database');

    if (req.method === 'GET') return res.status(500).send({
        message: 'Invalid method provided',
        code: 500
    })

    if (!req.body) return res.status(500).send({
        message: 'Please provide a valid body: missing key',
        code: 500
    })

    if (!key) return res.status(400).send({
        message: 'No key provided, please provide a key to validate.',
        code: 400
    });

    if (!check.success) return res.status(500).send({
        status: 'DB_INSTANCE_MISSING',
        message: createTeaPotError(),
        error: 'Please report this to our support team.',
        code: 500
    })
};

export const ValidateKey = { PreHandler, Handler };