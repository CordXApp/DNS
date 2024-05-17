import { Client, ClientOptions } from "discord.js";
import { EventHandler } from "./handlers/event.handler";
import { Database } from "../../prisma/prisma.client";
import { DNSServer } from "../../server/client";
import { Logger } from "../other/log.client";

class DNSClient extends Client {
  public server: DNSServer = new DNSServer();
  public logs: Logger = new Logger("[DNS:Client]", false);
  private events: EventHandler = new EventHandler(this);
  public db: Database = new Database();

  constructor(options: ClientOptions) {
    super(options);
    this.handlers();
  }

  public async init(token: string): Promise<void> {
    try {
      this.logs.info(`initializing the discord client`);

      await this.login(token);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(
          `[DNS] error initializing the discord client: ${err.message}`,
        );
      }

      console.error(`[DNS] error initializing the discord client: ${err}`);
      process.exit(1);
    }
  }

  public handlers(): void {
    this.events.load(__dirname + "/events");
  }
}

export default DNSClient;
