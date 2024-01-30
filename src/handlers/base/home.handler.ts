import { FastifyRequest, FastifyReply } from 'fastify';

const Handler = async (req: FastifyRequest, res: FastifyReply) => {

    return res.status(200).send({
        discord: 'https://cordx.lol/discord',
        message: 'Hey there, do you know what you are doing here? If not, please leave.',
        code: 200
    })
};

export const mainRoute = { Handler };