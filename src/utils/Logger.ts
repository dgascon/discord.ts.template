import { createLogger, format, transports } from "winston";

module.exports = createLogger({
  level: "info",
  exitOnError: false,
  format: format.combine(
    format.align(),
    format.timestamp({
      format: "DD-MMM-YYYY HH:mm:ss",
    }),
    format.align(),
    format.printf(
      (data) =>
        `[${data.level.toUpperCase()}] (${data.timestamp}) ${data.message}`
    )
  ),
  transports: [
    new transports.Console({
      level: "warn",
    }),
    new transports.File({
      level: "warn",
      filename: "./logs/warning.log",
    }),
    new transports.File({ filename: `./logs/logs.log` }),
  ],
});
