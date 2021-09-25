// Require the necessary discord.js classes
import { Client } from "./core";
require("dotenv").config();

const client: Client = new Client({
  intents: 32767,
});

client.start();
