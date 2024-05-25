import { PrismaClient } from "@prisma/client";
import { Logger } from "../clients/log.client";
import { BLACKLIST_CONFIG } from "../types/base.types";
import crypto from "node:crypto";
import dns from "node:dns";
import net from "node:net";

import {
  DBClient,
  Parameters,
  ResponseLayout,
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
      /**
       * Calculates the age of a domain
       * @param params
       * @returns { number } the age of the domain
       */
      age: async (params: Parameters): Promise<ResponseLayout> => {
        const domain = await this.domain.fetch({ domain: params.domain });

        if (!domain.success) return { success: false, message: 'Domain not found' };

        const currentDate = new Date();
        const createdAt = new Date(domain.data.createdAt);
        const ageInMilliseconds = currentDate.getTime() - createdAt.getTime();
        const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));

        return {
          success: true,
          message: 'Domain age calculated successfully!',
          data: {
            age: ageInDays,
          }
        }
      },
      /**
       * Creates a domain in the database
       * @param params
       * @returns { ResponseLayout } the response layout
       */
      create: async (params: Parameters): Promise<ResponseLayout> => {
        if (!params.domain)
          return { success: false, message: "Please provide a domain name" };
        if (!params.owner)
          return { success: false, message: "Please provide a domain owner" };

        const validate = await this.domain.validate({ domain: params.domain });

        if (!validate.success)
          return { success: false, message: validate.message };

        const txtContent = crypto.randomBytes(15).toString("hex");

        await this.prisma.users.update({
          where: { userid: params.owner },
          data: {
            domains: {
              create: {
                name: params.domain,
                content: txtContent,
                verified: false,
              }
            }
          }
        });

        return {
          success: true,
          message: "Domain created successfully",
          data: {
            name: params.domain,
            content: txtContent,
            verified: false
          },
        };
      },
      /**
       * Deletes a domain from the database
       * @param params
       * @returns { ResponseLayout } the response layout
       */
      delete: async (params: Parameters): Promise<ResponseLayout> => {
        const domain = await this.prisma.domains.findUnique({
          where: { name: params.domain },
        });

        if (!domain)
          return { success: false, message: "Domain not found" };

        const deleted = await this.prisma.domains.delete({
          where: { name: params.domain },
        });

        if (!deleted)
          return {
            success: false,
            message: "Failed to delete domain, please try again!",
          };

        return {
          success: true,
          message: "Domain deleted successfully!",
        };
      },
      /**
       * Fetches a domain from the database
       * @param params
       * @returns { ResponseLayout } the domain data
       */
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
      /**
       * Checks if the domain exists in the database
       * @param params
       *  @returns { boolean } true if the domain exists
       */
      exists: async (params: Parameters): Promise<boolean> => {
        const dom = await this.prisma.domains.findUnique({
          where: { name: params.domain },
        });

        return dom ? true : false;
      },
      /**
       * Sets the active domain for a user
       * @param params
       * @returns { ResponseLayout } the response layout
       */
      active: async (params: Parameters): Promise<ResponseLayout> => {

        this.logs.debug(`User: ${params.owner} is trying to set domain: ${params.domain}`);

        const user = await this.prisma.users.findUnique({ where: { userid: params.owner } });
        const valid = await this.domain.validate({ domain: params.domain });

        if (!user)
          return {
            success: false,
            message: "Unable to locate the provided user!",
          };

        if (!valid.success) return { success: false, message: valid.message };

        if (user.domain === params.domain)
          return { success: false, message: "This domain is already active!" };

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
      /**
       * Checks if the domain is blacklisted
       * @param params
       * @returns { boolean } true if the domain is blacklisted
       */
      blacklisted: async (params: Parameters): Promise<boolean> => {
        const isBlacklisted = params.config?.blacklist.some((word) =>
          params.domain?.includes(word),
        );

        return isBlacklisted ? true : false;
      },
      /**
       * Validates the domain name
       * @param params
       * @returns { ResponseLayout } the validation response
       */
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

        const blacklisted = await this.domain.blacklisted({
          domain: params.domain,
          config: BLACKLIST_CONFIG,
        });

        if (blacklisted) {
          await this.prisma.domains
            .delete({ where: { name: params.domain } })
            .catch(() => { });
          return {
            success: false,
            message:
              "The provided domain is blacklisted, please provide a valid domain name!",
          };
        }

        return { success: true, message: "Domain name is valid" };
      },
      /**
       * Verifies the domain by checking the DNS records
       * @param params
       * @returns { boolean } true if the domain is verified
       */
      verified: async (params: Parameters): Promise<any> => {
        const domain = await this.domain.fetch({ domain: params.domain });

        if (!domain.success) return {
          success: false,
          message: domain.message,
        }

        dns.resolveTxt(this.domain.split({ domain: params.domain }), (err, txtRecords) => {
          if (err) return {
            success: false,
            message: err.message
          }

          const txtExists = txtRecords.some((record) => record.includes(domain.data.content));

          if (!txtExists) return {
            success: false,
            message: 'Whoops, the provided domain does not have the required TXT record!'
          }

          dns.resolveCname(params.domain as string, async (err, cnameRecords) => {
            if (err && err.code !== 'ENODATA') return {
              success: false,
              message: err.message
            }

            const cnameExists = cnameRecords && cnameRecords.some((record) => record.includes(params.domain as string));

            if (!cnameExists) {
              dns.resolve4(params.domain as string, (err, aRecords) => {
                if (err) return {
                  success: false,
                  message: err.message
                }

                dns.resolve4(params.domain as string, (err, ips) => {
                  if (err) return {
                    success: false,
                    message: err.message
                  }

                  const ipExists = ips.some((ip) => aRecords.includes(ip));

                  return {
                    success: ipExists,
                    message: ipExists ? 'Domain ownership verified!' : 'Whoops, the provided domain does not have the required CNAME record'
                  }
                });
              });
            } else {
              return {
                success: true,
                message: 'Domain ownership verified!'
              }
            }
          });
        });

        return {
          success: false,
          message: 'Whoops, one or more of the required DNS records are missing!'
        }
      },
      expired: async (params: Parameters): Promise<boolean> => {
        const domain = await this.domain.fetch({ domain: params.domain });

        if (!domain.success) return false;

        const currentDate = new Date();
        const createdAt = new Date(domain.data.createdAt);
        const ageInMilliseconds = currentDate.getTime() - createdAt.getTime();
        const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));

        const expired = ageInDays >= 30 && !domain.data.verified ? true : false;

        if (expired) await this.domain.delete({ domain: params.domain }).catch((err: Error) => {
          this.logs.error(`Failed to delete expired domain: ` + err.message);
        });

        return expired;
      },
      /**
       * Lists all domains for a given user
       * @param params
       * @returns { ResponseLayout } the users domains
       */
      list: async (params: Parameters): Promise<ResponseLayout> => {
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
      /**
       * Splits the domain and removes any "sub" domains
       * @param params
       * @returns { string } the root domain
       */
      split: (params: Parameters): string => {
        const parts = params.domain?.split(".");
        const root = parts!.slice(-2).join(".");

        return root;
      },
      /**
       * Splits the domain and removes the root domain
       * @param params
       * @returns { string } the sub domain
       */
      sub: (params: Parameters): string => {
        const parts = params.domain?.split(".");
        const sub = parts!.slice(0, -2).join(".");

        return sub;
      }
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
