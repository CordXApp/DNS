import { List } from './v1/dns/list.handler';
import { View } from './v1/dns/view.handler';
import { mainRoute } from './base/home.handler';
import { healthCheck } from './base/health.handler';
import { ValidateKey } from './v1/validation/key';
import { CreateKey } from './v1/oauth/create.handler';

export const V1Handlers = { List, View, ValidateKey, CreateKey };
export const baseHandlers = { mainRoute, healthCheck };