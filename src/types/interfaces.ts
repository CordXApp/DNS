export interface User extends Document {
    id: number;
    owner: boolean;
    admin: boolean
    moderator: boolean;
    verified: boolean;
    beta: boolean;
    active_domain: string;
    domains: UserDomains[];
}

export interface UserDomains {
    name: string;
    verified: boolean
}

export interface Router {
    url: string;
    method: string;
    schema?: any;
    preHandler?: any;
    handler: any;
    config?: any;
}

export interface RouteSchema {
    summary: string;
    description: string;
    security?: any[];
    response: any;
    params?: any;
    querystring?: any;
    body?: any;
    tags: string[];
}

export interface DNSResponses {
    validate: DNS_Validate;
    verify: DNS_Verify;
    fetch: DNS_ViewDomain;
}

export interface DNS_Validate {
    success: boolean;
    message: string;
    expected?: string;
    received?: string;
    explanation?: string;
}

export interface DNS_Verify {
    success: boolean;
    message: string;
}

export interface DNS_ViewDomain {
    success: boolean;
    message?: string;
    domain?: {
        name: string;
        txtContent: string;
        verified: boolean;
    }
}