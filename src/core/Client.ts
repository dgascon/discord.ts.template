import { Client as DiscordClient } from "discord.js";
import { ClientOptions } from "../types";
import { Util, UtilConsole } from "../utils";
import { CommandHandler, EventHandler } from "./handler";

export class Client extends DiscordClient {
  protected _prefix: string;
  protected _delete_time: number;

  protected _util: Util;
  protected _utilConsole: UtilConsole;

  private readonly _events: EventHandler;
  private readonly _commands: CommandHandler;

  protected _data: object[];

  constructor(options: ClientOptions) {
    super(options);

    this._data = [];
    this._prefix = options.prefix ?? "$";
    this._delete_time = options.delete_time ?? 5000;

    this._util = new Util(this);
    this._utilConsole = new UtilConsole(this);

    this._events = new EventHandler(this);
    this._commands = new CommandHandler(this);
  }

  /**
   * Start the bot
   */
  public async start(): Promise<void> {
    await this._commands.load();
    await this._events.load();

    this._utilConsole.consoleReader();
    await super.login(process.env.TOKEN);
  }

  get prefix(): string {
    return this._prefix;
  }

  get delete_time(): number {
    return this._delete_time;
  }

  public get util(): Util {
    return this._util;
  }

  public get utilConsole(): UtilConsole {
    return this._utilConsole;
  }

  public get data(): object[] {
    return this._data;
  }

  public get events(): EventHandler {
    return this._events;
  }

  public get commands(): CommandHandler {
    return this._commands;
  }
}
