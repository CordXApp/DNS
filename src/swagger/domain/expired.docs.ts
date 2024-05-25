import { RouteSchema } from "../../types/base.types";

export class ExpiredDomDocs {
    constructor() { }

    public static schema: RouteSchema = {
        tags: ["DNS"],
        summary: "Check if a domain is expired.",
        description: "Check if the domain is expired or not.",
        querystring: {
            type: "object",
            properties: {
                domain: { type: "string" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: { type: "string" },
                    domain: { type: "string" },
                    expired: { type: "boolean" },
                },
            },
            400: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    code: { type: "number" },
                },
            },
            401: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    code: { type: "number" },
                },
            },
            404: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    code: { type: "number" },
                },
            },
            500: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    code: { type: "number" },
                },
            },
        },
    };
}
