import { PrismaClient } from "@prisma/client";
import { Logger } from "../clients/log.client";
import crypto from "node:crypto";
import dns from "node:dns";
import net from "node:net";

import {
  DBClient,
  Parameters,
  ResponseLayout,
  BlacklistConfig,
  BLACKLISTED_KEYWORDS,
} from "../types/clients/db.types";

const prisma = new PrismaClient();

export class Database implements DBClient {
  private logs: Logger;
  private prisma: PrismaClient;

  constructor() {
    this.logs = new Logger("[DNS:Prisma]", false);
    this.prisma = prisma;
  }

  public get user() {
    return {
      exists: async (id: string): Promise<Boolean> => {
        const user = await this.prisma.users.findUnique({
          where: { userid: id },
        });

        if (!user) return false;

        return true;
      },
      fetch: async (id: string): Promise<ResponseLayout> => {
        const user = await this.prisma.users.findUnique({
          where: { userid: id },
        });

        if (!user)
          return {
            success: false,
            message: "Unable to locate that user in our database.",
          };

        return { success: true, message: "User found", data: user };
      },
    };
  }

  public get domain() {
    return {
      create: async (params: Parameters): Promise<ResponseLayout> => {
        if (!params.domain)
          return { success: false, message: "Please provide a domain name" };
        if (!params.owner)
          return { success: false, message: "Please provide a domain owner" };

        const validate = await this.domain.validate({ domain: params.domain });

        if (!validate.success)
          return { success: false, message: validate.message };

        const create = await this.prisma.domains.create({
          data: {
            name: params.domain,
            content: crypto.randomBytes(15).toString("hex"),
            verified: false,
            user: params.owner,
          },
        });

        return {
          success: true,
          message: "Domain created successfully",
          data: create,
        };
      },
      fetch: async (params: Parameters): Promise<ResponseLayout> => {
        const dom = await this.prisma.domains.findUnique({
          where: { name: params.domain },
        });

        if (!dom) return { success: false, message: "Domain not found" };

        return {
          success: true,
          message: "Domain found",
          data: dom,
        };
      },
      exists: async (params: Parameters): Promise<boolean> => {
        const dom = await this.prisma.domains.findUnique({
          where: { name: params.domain },
        });

        return dom ? true : false;
      },
      setActive: async (params: Parameters): Promise<ResponseLayout> => {
        const user = await this.prisma.users.findUnique({
          where: { userid: params.owner },
        });
        const valid = await this.domain.validate({ domain: params.domain });

        if (!user)
          return {
            success: false,
            message: "Unable to locate the provided user!",
          };

        if (!valid.success) return { success: false, message: valid.message };

        if (user.domain === params.domain)
          return { success: true, message: "This domain is already active!" };

        const update = await this.prisma.users.update({
          where: { userid: params.owner },
          data: { domain: params.domain },
        });

        if (!update)
          return {
            success: false,
            message:
              "Failed to update domain, if this issue persist please report it!",
          };

        return {
          success: true,
          message: "Active domain updated successfully!",
        };
      },
      blacklisted: async (params: Parameters): Promise<boolean> => {
        const isBlacklisted = params.config?.blacklist.some((word) =>
          params.domain?.includes(word),
        );

        return isBlacklisted ? true : false;
      },
      removeSubdomain: (params: Parameters): string => {
        const parts = params.domain?.split(".");
        const root = parts!.slice(-2).join(".");

        return root;
      },
      validate: async (params: Parameters): Promise<ResponseLayout> => {
        const isNotIP = net.isIP(params.domain!) != 0;

        if (isNotIP)
          return {
            success: false,
            message:
              "Please provide a domain name (IP Addresses are not yet supported)",
          };

        const pattern = new RegExp("^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$");

        const parts = params.domain?.split(".");

        if (parts!.length < 2)
          return {
            success: false,
            message: "Please provide a valid domain name",
          };
        if (parts!.every((part) => pattern.test(part)))
          return {
            success: true,
            message: "Please provide a valid domain name",
          };

        if (/\\|https?:\/\//.test(params.domain!))
          return {
            success: false,
            message: params.domain?.includes("\\")
              ? "Error: escape sequence detected, please check your params"
              : "Please provide a domain name without the http(s) protocol",
          };

        const config: BlacklistConfig = { blacklist: BLACKLISTED_KEYWORDS };
        const blacklisted = await this.domain.blacklisted({
          domain: params.domain,
          config,
        });

        if (blacklisted) {
          await this.prisma.domains
            .delete({ where: { name: params.domain } })
            .catch(() => { });
          return {
            success: false,
            message:
              "This domain name is blacklisted, please choose a new one!",
          };
        }

        return { success: true, message: "Domain name is valid" };
      },
      verifyRecord: (params: Parameters): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
          const domain = await this.domain.fetch({ domain: params.domain });

          if (!domain.success) return reject(false);

          dns.resolve(
            this.domain.removeSubdomain({ domain: params.domain }),
            (err, records) => {
              if (err) return reject(false);

              const exists = records.some((record) =>
                record.includes(domain.data.content),
              );

              resolve(exists);
            },
          );
        });
      },
      listDomains: async (params: Parameters): Promise<ResponseLayout> => {
        const { owner } = params;

        if (!owner)
          return {
            success: false,
            message: "Please provide a user to list domains for!",
          };

        const domains = await this.prisma.domains.findMany({
          where: { user: owner },
          select: {
            name: true,
            createdAt: true,
            verified: true,
          },
        });

        const user = await this.prisma.users.findUnique({
          where: { userid: owner },
        });

        if (!user) return { success: false, message: "User not found" };
        if (!domains) return { success: false, message: "No domains found" };

        return {
          success: true,
          message: "Here is the requested users domains",
          data: {
            active: user.domain ? user.domain : "No domain set",
            available: domains.length > 0 ? domains : "No domains found",
          },
        };
      },
    };
  }

  public get domain_stats() {
    return {
      total: async (): Promise<number> => {
        const total = await this.prisma.domains.count();

        return total;
      },
    };
  }

  public get secret() {
    return {
      exists: async (key: string): Promise<Boolean> => {
        const secrets = await this.prisma.secrets.findMany();

        if (!secrets || secrets.length === 0) return false;

        const keys = secrets.map((secret: any) =>
          this.secret.decrypt(secret.key),
        );

        if (keys.length === 0) return false;

        return keys.includes(key) ? true : false;
      },
      decrypt: (encryptedText: string): string => {
        const decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          Buffer.from(process.env.ENCRYPTION_KEY as string, "hex"),
          Buffer.alloc(16, 0),
        );
        const decrypted = Buffer.concat([
          decipher.update(Buffer.from(encryptedText, "hex")),
          decipher.final(),
        ]);
        return decrypted.toString("utf8");
      },
    };
  }
}
