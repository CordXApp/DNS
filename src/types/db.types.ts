import { InstanceClient } from '../clients/instances/instance.client';
import { IInstance } from './instance';


export interface Responses {
    success: boolean;
    status?: string;
    message?: string;
    instance?: InstanceClient;
    database?: any;
    code?: number;
    keys?: Key[];
    key?: string;
}

export interface Domain {
    name: string;
    verified: boolean;
    txtContent: string;
}

export interface Key {
    key: string;
    admin: boolean;
    createdAt: Date;
}

export interface Client {
    instance: IInstance;
}

export interface KeyType {
    level: 'ADMIN' | 'BASIC'
}