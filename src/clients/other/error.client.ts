import {
    createKeyError,
    createTeaPotError,
    createRateLimitError
} from "../../res/errors";


export class CordXError extends Error {
    public code: number;
    public status: string;
    public details?: { [key: string]: string } | string[];
    public static keyErrors: typeof createKeyError = createKeyError;
    public static teaPotErrors: typeof createTeaPotError = createTeaPotError;
    public static rateLimitErrors: typeof createRateLimitError = createRateLimitError;

    constructor(status: string, code?: number, message?: string, details?: any) {
        super(message);

        this.name = this.constructor.name;
        this.code = code ? code : 0;
        this.details = details;
        this.status = status;

        Error.captureStackTrace(this, this.constructor);
    }

    toString(): string {
        return `CordXError: ${this.message} (code: ${this.code}, details: ${JSON.stringify(this.details)}, status: ${this.status})`;
    }
}