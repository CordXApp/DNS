import { InstanceClient } from '../../clients/instances/instance.client';
import { IInstance } from './instance.types';
import { DNSClient } from '../../clients/database/dns.client';
import { Keys } from '../../clients/database/key.client';
import { Connection } from 'mongoose';
import mongo from 'mongoose';


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
    instance: IInstance<Properties>;
}

export interface Properties {
    mongoose: typeof mongo;
    connect: () => Promise<void>;
    disconnect: () => void;
}

export interface KeyType {
    level: 'ADMIN' | 'BASIC'
}