import { KeyModel } from "../../schemas/keys.schema";
import { IInstance } from '../../types/clients/instance.types';
import { CordXError } from '../../clients/other/error.client';
import { Keys } from "../../clients/database/key.client";

export interface Client {
    instance: IInstance<Properties>;
}

export interface Properties {
    model: typeof KeyModel;
    get(key: string): Promise<Responses>;
    create(admin: boolean): Promise<Responses['create']>;
    delete(key: string): Promise<Responses>;
    validate(key: string, requires: Perms['level']): Promise<Responses>;
    random(admin: boolean): Promise<Responses>;
}

export interface Key {
    key: string;
    admin: boolean;
    createdAt: Date;
    lastUsed: Date;
}

export interface Perms {
    level: 'ADMIN' | 'BASIC'
}

export interface Responses {
    get: GetKeyResponse;
    create: CreateKeyResponse;
    delete: DeleteKeyResponse;
    validate: ValidateKeyResponse;
    random: RandomKeyResponse;
}

export interface CreateKeyResponse {
    success: boolean;
    message?: string;
    key?: Key;
}

export interface DeleteKeyResponse {
    success: boolean;
    message?: string;
}

export interface GetKeyResponse {
    success: boolean;
    message?: string;
    key?: Key;
}

export interface ValidateKeyResponse {
    success: boolean;
    status: string;
    message?: string;
    code: number;
}

export interface RandomKeyResponse {
    success: boolean;
    status?: string;
    key?: Key;
}

/**
 * ERROR RESPONSES 
 */
export const KeyErrors: { [status: string]: (details?: any) => CordXError } = {
    'KEY_NOT_FOUND': (details) => new CordXError('KEY_NOT_FOUND', 404, CordXError.keyErrors(), details),
    'KEY_NOT_AUTHORIZED': (details) => new CordXError('KEY_NOT_AUTHORIZED', 401, CordXError.keyErrors(), details),
    'KEY_VALIDATION_FAILED': (details) => new CordXError('KEY_VALIDATION_FAILED', 400, CordXError.keyErrors(), details),
    'KEY_CREATION_FAILED': (details) => new CordXError('KEY_CREATION_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_DELETION_FAILED': (details) => new CordXError('KEY_DELETION_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_CHECK_FAILED': (details) => new CordXError('KEY_CHECK_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_CLEANUP_FAILED': (details) => new CordXError('KEY_CLEANUP_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_CLEANUP_SUCCESS': (details) => new CordXError('KEY_CLEANUP_SUCCESS', 200, CordXError.keyErrors(), details),
    'KEY_VERSION_MISMATCH': (details) => new CordXError('KEY_VERSION_MISMATCH', 500, CordXError.keyErrors(), details),
    'KEY_VERSION_UPDATE_FAILED': (details) => new CordXError('KEY_VERSION_UPDATE_FAILED', 500, CordXError.keyErrors(), details),
    'KEY_VERSION_UPDATE_SUCCESS': (details) => new CordXError('KEY_VERSION_UPDATE_SUCCESS', 200, CordXError.keyErrors(), details),
    'API_KEY_MISMATCH': (details) => new CordXError('API_KEY_MISMATCH', 418, CordXError.teaPotErrors(), details),
    'ENV_VALIDATION_FAILED': (details) => new CordXError('ENV_VALIDATION_FAILED', 500, CordXError.keyErrors(), details),
    'INVALID_KEY_TYPE': (details) => new CordXError('INVALID_KEY_TYPE', 500, CordXError.keyErrors(), details),
};