import { UserModel } from "../../schemas/user.schema";
import { IInstance } from "./instance.types";
import { Document } from "mongoose";

export interface Client {
    instance: IInstance<Properties>;
}

export interface Properties {
    model: typeof UserModel;
    blacklisted: (domain: string) => boolean;
    check: (domain: string, record: string) => Promise<boolean>;
    resolve: (domain: string) => Promise<{ success: boolean, data?: { addresses: string[], domain: string } }>;
    validate: (domain: string) => Promise<Responses['validate']>;
    verified: (domain: string) => Promise<Responses['verify']>;
    fetch: (domain: string) => Promise<Responses['fetch']>;
}

export interface Responses {
    validate: ValidationResponse;
    verify: VerificationResponse;
    fetch: ViewDomainResponse;
}

export interface ValidationResponse {
    success: boolean;
    message: string;
    expected?: string;
    received?: string;
    explanation?: string;
}

export interface VerificationResponse {
    success: boolean;
    message: string;
}

export interface ViewDomainResponse {
    success: boolean;
    message?: string;
    domain?: {
        name: string;
        txtContent: string;
        verified: boolean;
    }
}