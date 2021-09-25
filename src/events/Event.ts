import { Client } from "../core";

export interface EventOptions {
  once?: boolean;
}

export class Event {
  protected client: Client;
  public name: string;
  public type: "once" | "on";
  public processEvent: boolean;

  constructor(client: Client, name: string, options: EventOptions = {}) {
    this.client = client;
    this.name = name;
    this.type = options.once ? "once" : "on";
    this.processEvent = false;
  }

  async run(...args: any) {
    throw new Error(`The run method has not been implemented in ${this.name}`);
  }
}
