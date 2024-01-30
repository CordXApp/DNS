import { Router } from '../../types/interfaces';
import { baseHandlers } from '../../handlers/base.handler';

const base: Router = {
    url: '/',
    method: 'GET',
    handler: baseHandlers.healthCheck.Handler
}

const check: Router = {
    url: '/health',
    method: 'GET',
    handler: baseHandlers.healthCheck.Handler
}

export const BaseRoutes: any[] = [
    base,
    check
];