import { RouteSchema } from "../../types/base.types";

export class ActiveDomDocs {
    constructor() { }

    public static get: RouteSchema = {
        tags: ["Users"],
        summary: "Get a users active domain",
        description: "Get the active domain of a user",
        params: {
            type: "object",
            properties: {
                user: { type: "string" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    data: { type: "string" },
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

    public static post: RouteSchema = {
        tags: ["Users"],
        summary: "Set a users active domain",
        description: "Set the active domain of a user",
        params: {
            type: "object",
            properties: {
                user: { type: "string" },
            },
        },
        body: {
            type: "object",
            properties: {
                domain: { type: "string" },
                secret: { type: "string" },
            },
        },
        response: {
            200: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    createdAt: { type: "string" },
                    verified: { type: "boolean" },
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
