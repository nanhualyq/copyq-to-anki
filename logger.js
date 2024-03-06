const winston = require("winston");
const Transport = require('winston-transport');
const child_process = require("child_process");

class NotificationTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    child_process.execSync(
      `copyq notification '.title' 'Error' '.message' '${info.message}'`
    );

    // Perform the writing to the remote service
    callback();
  }
}

const dirname = __dirname + '/logs/';
const logger = winston.createLogger({
  level: "info",
    format: winston.format.json(),
  //   defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      dirname,
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      dirname,
      filename: "combined.log",
    }),
  ],
  exceptionHandlers: [
    new NotificationTransport(),
    new winston.transports.File({ dirname, filename: "exceptions.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
