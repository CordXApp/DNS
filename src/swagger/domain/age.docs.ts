import { RouteSchema } from "../../types/base.types";

export class DomAgeDocs {
    constructor() { }

    public static schema: RouteSchema = {
        tags: ["DNS"],
        summary: "Get the age of a domain.",
        description: "Get the age of a domain in days.",
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
                    domain: { type: "string" },
                    age: { type: "string" },
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
