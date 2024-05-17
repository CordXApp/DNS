import { config as dotenv } from "dotenv";
import { Partials } from "discord.js";
import DNSCLient from "./clients/discord/dns.client";

dotenv();

const client: DNSCLient = new DNSCLient({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping",
    "MessageContent",
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
  ],
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

client.init(process.env.DISCORD_TOKEN!);
