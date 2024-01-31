import { HomeSchema } from './home/home.docs';
import { ListDomainsSchema } from './v1/dns/list.docs';
import { ViewDomainSchema } from './v1/dns/view.docs';
import { CreateKeySchema } from './v1/auth/create.docs';

export const V1Docs = {
    HomeSchema,
    ViewDomainSchema,
    ListDomainsSchema,
    CreateKeySchema
}