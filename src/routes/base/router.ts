import { Router } from '../../types/interfaces';

const base: Router = {
    url: '/',
    method: 'GET',
    handler: (req: any, res: any) => {
        return res.status(200).send({
            discord: 'https://cordx.lol/discord',
            message: 'Hey there, do you know what you are doing here? If not, please leave.',
            code: 200
        })
    },
}

export const BaseRoutes: any[] = [
    base,
];