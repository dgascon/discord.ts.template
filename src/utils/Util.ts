import { Client } from "../core";
import path from "path";

export class Util {
  private client: Client;
  static Debug: boolean = true;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Check if input is a Class
   * @param input is a file
   * @returns {boolean} true if input is a class else false
   */
  static isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  /**
   * Return absolute path
   * @returns {string}
   */
  static get directory() {
    return `${path.dirname(require.main?.filename ?? "")}${path.sep}`;
  }
}
