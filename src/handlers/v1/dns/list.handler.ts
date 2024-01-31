import { FastifyRequest, FastifyReply } from 'fastify';
import { Request } from '../../../types/fastify.types';

const Handler = async (req: FastifyRequest<Request>, res: FastifyReply) => {
    res.header('Content-Type', 'application/json');

    const db = req.db;
    const user = req.query.user;
    const data = await db.dns.model.findOne({ id: user });

    return res.status(200).send({
        user: data.id,
        domains: data.domains
    })
};

const PreHandler = async (req: FastifyRequest<Request>, res: FastifyReply) => {
    res.header('Content-Type', 'application/json');

    const db = req.db;
    const auth = req.headers['authorization'];
    const user = req.query.user;

    if (!auth) return res.status(401).send({
        status: 'UNAUTHORIZED',
        message: 'You are not authorized to access this resource.',
        code: 401
    });

    if (!user) return res.status(400).send({
        status: 'BAD_REQUEST',
        message: 'Please provide a valid user ID to fetch domains for.',
        code: 400
    });

    const discordIdRegex = /^\d{18}$/;

    if (!discordIdRegex.test(user)) return res.status(400).send({
        status: 'BAD_REQUEST',
        message: 'Provided user ID should be a valid Discord Snowflake ID.',
        code: 400
    });

    const data = await db.dns.model.findOne({ id: user });

    console.log(db.dns.model)

    if (!data) return res.status(404).send({
        status: 'USER_NOT_FOUND',
        message: 'The user you are looking for does not exist.',
        code: 404
    });

    if (!data.domains) return res.status(404).send({
        status: 'DOMAIN_NOT_FOUND',
        message: 'This user does not have any domains registered.',
        code: 404
    });
};

export const List = { PreHandler, Handler };