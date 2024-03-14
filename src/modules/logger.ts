import { get } from "lodash";
import { notify } from "node-notifier";
import { createLogger, format, transports } from "winston";

import Transport from "winston-transport";
import { DATA_DIR, IS_PROD } from "./init";

class NotificationTransport extends Transport {
  constructor(opts: undefined) {
    super(opts);
  }

  log(info: unknown, callback: () => void) {
    notify({
      title: "Error",
      message: get(info, "message"),
    });

    // Perform the writing to the remote service
    callback();
  }
}

const dirname = `${DATA_DIR}/logs`;
const logger = createLogger({
  level: "info",
  format: format.json(),
  //   defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({
      dirname,
      filename: "error.log",
      level: "error",
    }),
    new transports.File({
      dirname,
      filename: "combined.log",
    }),
  ],
  exceptionHandlers: [
    new NotificationTransport(undefined),
    new transports.File({ dirname, filename: "exceptions.log" }),
  ],
});

if (IS_PROD) {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export default logger;
