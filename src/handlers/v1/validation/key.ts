import { Database } from '../../../clients/database/db.client';
import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * @description Checks if the provided key is a valid api key,
 * if it is it will return the document, including the admin status.
 * 
 * @note The handler will return a 200 status code only as the prehandler
 * is ran prior to the handler and will determine if the key is valid or not.
 */
const Handler = async (req: FastifyRequest<{ Body: { key: string } }>, res: FastifyReply) => {
    const { key } = req.body

    const check = await Database.getInstance().then(async (db) => {
        return await db.validateKey(key, false);
    });

    return res.status(200).send({
        message: check.message,
        key: check.key
    })
};

const PreHandler = async (req: FastifyRequest<{ Body: { key: string } }>, res: FastifyReply) => {
    const { key } = req.body

    if (!key) return res.status(400).send({
        message: 'No key provided, please provide a key to validate.',
        code: 400
    })

    const check = await Database.getInstance().then(async (db) => {
        return await db.validateKey(key, false);
    });

    if (!check.success) return res.status(400).send({
        message: check.message,
        code: 400
    })
};

export const ValidateKey = { PreHandler, Handler };