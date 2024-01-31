import { Logger } from '../../clients/other/log.client';

export interface IInstance<T> extends InstanceProperties {
    id: string;
    name: string;
    createdAt: Date | null;
    lastUsed: Date | null;
    idleTimeout: NodeJS.Timeout | null;
    idleStart: number | null;
    state: 'HEALTHY' | 'UNHEALTHY' | 'BUSY' | 'IDLE' | 'DESTROYED' | 'CLEANSING' | 'CLEANSED';
    logs: Logger | null;
    properties: T;
}

export interface InstanceProperties {
    view: () => Partial<IInstance<InstanceProperties>>;
    execute: (operation: string) => void;
    destroy: () => Promise<boolean>;
    cleanup: () => Promise<boolean>;
    setState: (state: IInstance<InstanceProperties>['state']) => void | string;
    setLastUsed: () => any;
}