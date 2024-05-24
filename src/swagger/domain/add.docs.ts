import { RouteSchema } from "../../types/base.types";

export class AddDomDocs {
    constructor() { }

    public static schema: RouteSchema = {
        tags: ["DNS"],
        summary: "Add a new user domain.",
        description: "Add a new domain to a user for uploads and other services.",
        params: {
            type: "object",
            properties: {
                user: { type: "string" },
            },
        },
        querystring: {
            type: "object",
            properties: {
                domain: { type: "string" },
                secret: { type: "string" },
            }
        },
        response: {
            201: {
                type: "object",
                properties: {
                    status: { type: "string" },
                    message: { type: "string" },
                    data: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            content: { type: "string" },
                            verified: { type: "boolean" },
                        }
                    },
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
