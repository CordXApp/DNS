import { RouteSchema } from "../../types/base.types";

export class ListUserDomsDocs {
  constructor() { }

  public static schema: RouteSchema = {
    tags: ["Users"],
    summary: "List all of a users domains",
    description:
      "List all of the domains that a user has registered, including their active domain",
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
          active: { type: "string" },
          available: {
            type: "array",
            items: {
              type: "object",
              items: {
                name: { type: "string" },
                createdAt: { type: "string" },
                verified: { type: "boolean" },
              },
            },
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
