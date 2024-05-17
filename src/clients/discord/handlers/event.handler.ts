import { readdirSync } from "node:fs";
import { join, sep } from "node:path";
import type DNSClient from "../dns.client";
import type { IEvent } from "../@types/client";

export class EventHandler {
  private client: DNSClient;

  constructor(client: DNSClient) {
    this.client = client;
  }

  public load(dir: string): void {
    readdirSync(dir).forEach(async (subDir: string): Promise<void> => {
      const events = readdirSync(`${dir}${sep}${subDir}${sep}`);

      for (const event of events) {
        const instance = await import(join(dir, subDir, event));
        const listener: IEvent = new instance.default();

        if (listener.props.once) {
          this.client.once(listener.props.name, (...args) =>
            listener.exec(this.client, ...args),
          );
          return;
        }

        this.client.on(listener.props.name, (...args) =>
          listener.exec(this.client, ...args),
        );
      }
    });
  }
}
