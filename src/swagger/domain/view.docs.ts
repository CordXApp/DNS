import { RouteSchema } from "../../types/base.types";

export class ViewDomDocs {
    constructor() { }

    public static schema: RouteSchema = {
        tags: ["DNS"],
        summary: "View the details of a domain",
        description:
            "View the details of a domain, including its records and other information",
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
