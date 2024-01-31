import { CreateKeySchema } from '../../../../docs/v1/auth/create.docs';
import { V1Handlers } from '../../../../handlers/base.handler';
import { Router } from '../../../../types/base.types';

export const validateAPIKey: Router = {
    url: '/v1/validate/key',
    method: 'POST',
    //schema: CreateKeySchema,
    preHandler: V1Handlers.ValidateKey.PreHandler,
    handler: V1Handlers.ValidateKey.Handler
}