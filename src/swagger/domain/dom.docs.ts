import { RouteSchema } from "../../types/base.types";

export class DomainDocs {
  constructor() { }

  public static ViewDomain: RouteSchema = {
    tags: ["DNS"],
    summary: "View the details of a domain",
    description:
      "View the details of a domain, including its records and other information",
    params: {
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

  public static GetActiveDomain: RouteSchema = {
    tags: ["DNS"],
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

  public static setActiveDomain: RouteSchema = {
    tags: ["DNS"],
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
