import { Router } from '../../../../types/interfaces';
import { V1Handlers } from '../../../../handlers/base.handler';
import { V1Docs } from '../../../../docs/base';
import { V1Configs } from '../../../../configs/v1/base';


export const view: Router = {
    method: 'GET',
    url: '/v1/dns/view',
    preHandler: V1Handlers.View.PreHandler,
    handler: V1Handlers.View.Handler,
    schema: V1Docs.ViewDomainSchema,
    config: V1Configs.ViewConfig
}