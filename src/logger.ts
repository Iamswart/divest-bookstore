import { createLogger, transports } from "winston";


const options = {
  file: {
    level: "info",
    filename: "./logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, 
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const localFormat = {
  level: "debug",
  transports: [
    new transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),

    new transports.File(options.file),
    new transports.Console(options.console),
  ],
};

const logger = createLogger(localFormat);

export const stream = {
  write: (message: string): void => {
    logger.info(message);
  },
};

export default logger;
