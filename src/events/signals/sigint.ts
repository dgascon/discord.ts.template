import { Event, EventOptions } from "../Event";
import { Client } from "../../core";

const ms = require("ms");
const Logger = require("../../utils/Logger");

module.exports = class extends Event {
  constructor(...args: [Client, string, EventOptions]) {
    super(...args);
    this.processEvent = true;
    this.name = "SIGINT";
  }

  async run() {
    if (this.client.uptime) {
      let text: string = `The bot remained active for ${ms(this.client.uptime, {
        long: true,
      })}`;
      console.log(text);
      Logger.info(text);
    }
    process.exit(0);
  }
};
