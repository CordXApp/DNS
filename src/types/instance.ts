import { Logger } from '../clients/other/log.client';

export interface IInstanceClient {
    instance: IInstance;
}

export interface IInstance {
    id: string;
    name: string;
    createdAt: Date | null;
    lastUsed: Date | null;
    idleTimeout: NodeJS.Timeout | null;
    idleStart: number | null;
    state: 'HEALTHY' | 'UNHEALTHY' | 'BUSY' | 'IDLE' | 'DESTROYED' | 'CLEANSING' | 'CLEANSED';
    logs: Logger | null;
    properties: any;
    execute: (operation: string) => void;
    destroy: () => Promise<boolean>;
    cleanup: () => Promise<boolean>;
    setState: (state: IInstance['state']) => void | string;
    setLastUsed: () => any;
    view: () => Partial<IInstance>;
}

export interface InstanceInfo {
    id: string;
    name: string;
    createdAt: Date;
    lastUsed: Date;
    idleTimeout: NodeJS.Timeout | null;
    idleStart: number | null;
    state: 'HEALTHY' | 'UNHEALTHY' | 'BUSY' | 'IDLE' | 'DESTROYED' | 'CLEANSING';
    logs: Logger | null;
    properties: any;
}