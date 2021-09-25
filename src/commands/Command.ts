import { Client } from "../core";
import { Message, PermissionResolvable } from "discord.js";

export enum ECategory {
  Miscellaneous = "Miscellaneous",
}

interface CommandOptions {
  name?: string;
  aliases?: string[];
  description?: string;
  category?: ECategory;
  usage?: string;
  argsMin?: number;
  permissions?: PermissionResolvable[];
}

export class Command {
  private readonly _client: Client;
  private readonly _name: string;
  private readonly _aliases: string[];
  private readonly _category: string;
  private readonly _usage: string;
  private readonly _argsMin: number;
  private readonly _permissions: PermissionResolvable[];

  get client(): Client {
    return this._client;
  }

  get name(): string {
    return this._name;
  }

  get aliases(): string[] {
    return this._aliases;
  }

  get category(): string {
    return this._category;
  }

  get usage(): string {
    return this._usage;
  }

  get argsMin(): number {
    return this._argsMin;
  }

  get permissions(): PermissionResolvable[] {
    return this._permissions;
  }

  constructor(client: Client, name: string, options: CommandOptions = {}) {
    this._client = client;
    this._name = options.name ?? name;
    this._aliases = options.aliases ?? [];
    this._category = options.category ?? ECategory.Miscellaneous;
    this._usage = options.usage ?? "No usage provided.";
    this._argsMin = options.argsMin ?? -1;
    this._permissions = options.permissions ?? [];
  }

  async run(message: Message, args: string[]) {
    throw new Error(`Command ${this._name} doesn't provide a run method!`);
  }
}
