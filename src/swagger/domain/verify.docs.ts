import { RouteSchema } from "../../types/base.types";

export class VerifyDomDocs {
    constructor() { }

    public static schema: RouteSchema = {
        tags: ["DNS"],
        summary: "Check if a domain is verified.",
        description: "Verify if the domain contains the required TXT and CNAME records.",
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
                    status: { type: "string" },
                    message: { type: "string" },
                    code: { type: "number" },
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
