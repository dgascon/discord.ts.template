import { Client } from "discord.js";
import { Event } from "../core";
const Logger = require("../utils/Logger");

module.exports = class extends Event {
  async run(client: Client) {
    console.log("Ready");
    Logger.info("Event Ready called");
  }
};
