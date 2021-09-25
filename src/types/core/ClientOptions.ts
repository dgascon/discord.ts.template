import { ClientOptions as DiscordClientOptions } from "discord.js";

export interface ClientOptions extends DiscordClientOptions {
    prefix?: string,
    delete_time?: number,
}