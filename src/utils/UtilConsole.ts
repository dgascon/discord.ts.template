import { Client } from "../core";

export class UtilConsole {
  constructor(private client: Client) {}

  static editLine(
    text: string | string[],
    dots: number = 0,
    cursor: number = 0
  ): NodeJS.Timer | undefined {
    process.stdout.cursorTo(cursor, process.stdout.rows - 2);
    process.stdout.clearLine(0);
    let txt: string = Array.isArray(text) ? text.join(" ") : text;
    process.stdout.write(txt);

    if (dots) {
      let count = 0;
      return setInterval(() => {
        if (count % (dots + 1) > 0) process.stdout.write(".");
        else {
          process.stdout.cursorTo(txt.length);
          process.stdout.clearLine(1);
        }
        count++;
      }, 200);
    }
  }

  public consoleReader() {
    let y = process.openStdin();
    y.addListener("data", (res) => {
      let x = res.toString().toLowerCase().trim().split(/ +/g).join(" ");
      if (x.startsWith("reload")) this.reload();
    });
  }

  private reload() {
    let load = UtilConsole.editLine(`Reload in progress`, 3);
    setTimeout(async () => {
      await this.client.commands.load();
      await this.client.events.load();
      if (load) await clearInterval(load);
      await UtilConsole.editLine(`Reload finished.\n`);
    }, 2000);
  }
}
