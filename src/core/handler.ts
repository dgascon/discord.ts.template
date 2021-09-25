import { Client } from "./Client";
import { Collection } from "discord.js";
import { Event } from "../events/Event";
import { Util } from "../utils";
import path from "path";
import { Command } from "../commands/Command";

const { promisify } = require("util");
const glob = promisify(require("glob"));

const Logger = require("../utils/Logger");

export class EventHandler {
  private _events: Collection<string, Event>;

  public get events(): Collection<string, Event> {
    return this._events;
  }

  set events(value: Collection<string, Event>) {
    this._events = value;
  }

  constructor(private client: Client, private folder = "events") {
    this._events = new Collection<string, Event>();
  }

  /**
   * Load the events contained in the folder
   */
  public async load() {
    new Promise((resolve, reject) => {
      if (this.events.size) {
        this.client.removeAllListeners();
        this.events = new Collection<string, Event>();
      }
      let directory: string = `${Util.directory}${this.folder}/**/!(Event).${
        process.env.NODE_ENV === "development" ? "ts" : "js"
      }`;

      if (process.env.DEBUG) Logger.info(`Events directory ${directory}`);

      glob(directory).then((events: string[]) => {
        if (!events.length && Util.Debug)
          reject(
            new Error(
              `Event list is empty, the folder [${this.folder}] may not exist`
            )
          );
        for (const eventFile of events) {
          if (process.env.DEBUG) Logger.info(`Events file ${eventFile}`);

          delete require.cache[eventFile];

          const { name } = path.parse(eventFile);
          const File = require(eventFile);

          if (!Util.isClass(File)) {
            if (process.env.DEBUG)
              Logger.info(`Events [${name}] doesn't export a class.`);
            continue;
          }

          const event = new File(this.client, name.toLowerCase());
          if (!(event instanceof Event)) {
            if (process.env.DEBUG)
              Logger.info(`Event [${name}] doesn't belong in events.`);
            continue;
          }
          this.events.set(event.name, event);

          if (event.processEvent)
            process[event.type](event.name, (...args: any) =>
              event.run(...args)
            );
          else
            this.client[event.type](event.name, (...args: any) =>
              event.run(...args)
            );
        }
        resolve("Success");
      });
    }).catch((e) => {
      if (process.env.DEBUG) Logger.info(`Events information ${e.message}`);
    });
  }
}

export class CommandHandler {
  private _commands: Collection<string, Command>;

  public get commands(): Collection<string, Command> {
    return this._commands;
  }

  set commands(value: Collection<string, Command>) {
    this._commands = value;
  }

  constructor(private client: Client, private folder: string = "commands") {
    this._commands = new Collection<string, Command>();
  }

  /**
   * Load the commands contained in the folder
   */
  public async load() {
    new Promise(async (resolve, reject) => {
      if (this._commands.size) this._commands.clear();

      let directory: string = `${Util.directory}${this.folder}/**/!(Command).${
        process.env.NODE_ENV === "development" ? "ts" : "js"
      }`;

      if (process.env.DEBUG) Logger.info(`Commands directory ${directory}`);

      await glob(directory).then((commands: string[]) => {
        if (!commands.length)
          reject(
            new Error(
              `Command list is empty, the folder [${this.folder}] may not exist.`
            )
          );
        for (const commandFile of commands) {
          if (process.env.DEBUG) Logger.info(`Command file ${commandFile}`);
          delete require.cache[commandFile];

          const { name } = path.parse(commandFile);
          const File = require(commandFile);

          if (!Util.isClass(File)) {
            if (process.env.DEBUG)
              Logger.info(`Command [${name} doesn't export a class.`);
            continue;
          }
          const command = new File(this.client, name.toLowerCase());
          if (!(command instanceof Command)) {
            if (process.env.DEBUG)
              Logger.info(`Command [${name}] doesn't belong in commands.`);
            continue;
          }
          this._commands.set(command.name, command);

          if (command.aliases.length) {
            for (const alias of command.aliases) {
              if (this._commands.has(alias))
                throw Error(`Duplicate commands or aliases [${alias}]`);
              this._commands.set(alias, command);
            }
          }
        }
        resolve("Success");
      });
    }).catch((e) => {
      if (process.env.DEBUG) Logger.info(`Commands information ${e.message}`);
    });
  }
}
