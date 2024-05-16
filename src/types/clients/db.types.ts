export interface DBClient {
    get domain(): {
        create: (params: Parameters) => Promise<ResponseLayout>;
        fetch: (params: Parameters) => Promise<ResponseLayout>;
        exists: (params: Parameters) => Promise<boolean>;
        blacklisted: (params: Parameters) => Promise<boolean>;
        validate: (params: Parameters) => Promise<ResponseLayout>;
    };
}

export interface Parameters {
    domain: string;
    owner?: string;
    config?: BlacklistConfig;
}

export interface ResponseLayout {
    success: boolean;
    message: string;
    data?: any;
}

export interface BlacklistConfig {
    blacklist: string[];
}

export const BLACKLISTED_KEYWORDS = [
    'localhost',
    'cordx',
    'devhub',
    'discord',
    'discordbots',
    'discordbot',
    'discordextremelist',
    'discordlistology',
    'discordlist',
    'makesmehorny',
    'infinitybots',
    'botlist'
]
