import { Router } from '../../../../types/base.types';
import { V1Handlers } from '../../../../handlers/base.handler';
import { V1Docs } from '../../../../docs/base';
import { V1Configs } from '../../../../configs/v1/base';


export const list: Router = {
    method: 'GET',
    url: '/v1/dns/list',
    preHandler: V1Handlers.List.PreHandler,
    handler: V1Handlers.List.Handler,
    schema: V1Docs.ListDomainsSchema,
    config: V1Configs.ListConfig
}