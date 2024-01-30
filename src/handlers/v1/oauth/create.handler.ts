import { FastifyRequest, FastifyReply } from 'fastify';

const Handler = async (req: FastifyRequest<{ Headers: { Authorization: string } }>, res: FastifyReply) => {
    res.header('Content-Type', 'application/json');

    const key = await req.db.keys.create(false);

    if (!key.success) return res.status(key.code as number).send({
        message: key.message,
        code: key.code
    })
};

const PreHandler = async (req: FastifyRequest<{ Headers: { Authorization: string, } }>, res: FastifyReply) => {
    res.header('Content-Type', 'application/json');

    const auth = req.headers['authorization'];
    const validate = await req.db.keys.validate(auth.replace('CordXAdmin ', ''));

    if (!validate.success) return res.status(validate.code as number).send({
        message: validate.message,
        code: validate.code
    })
};

export const CreateKey = { PreHandler, Handler };