import { Database } from '../../../../clients/database/db.client';
import { CreateKeySchema } from '../../../../docs/v1/auth/create.docs';
import { V1Handlers } from '../../../../handlers/base.handler';
import { Router } from '../../../../types/base.types';

export const createApiKey: Router = {
    url: '/v1/oauth/keys/create',
    method: 'GET',
    schema: CreateKeySchema,
    preHandler: V1Handlers.CreateKey.PreHandler,
    handler: V1Handlers.CreateKey.Handler
}