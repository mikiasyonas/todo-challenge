/* eslint-disable max-len */
const winston = require('winston');
const morgan = require('morgan');

const logFormat = winston.format.printf(({
  level, message, timestamp,
}) => {
  const singleLineLog = JSON.stringify({
    level,
    timestamp,
    message,
  });

  const replacedLog = singleLineLog.replace(':"{', ':{').replace('"}"', '"}').replace(/\\"/g, '"');
  return replacedLog;
});

const transportOptions = {
  file: {
    level: 'info',
    filename: '../logs/log.json',
    handleExceptions: true,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        logFormat,
    ),
    maxSize: 5242880,
    maxFiles: 5,
    colorize: false,
  },

  console: {
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.printf(({timestamp, level, message}) => `${timestamp} [${level}]: ${message}`),
    ),
    handleExeptions: true,
    colorize: true,
  },
};

const loggerConfig = {
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.File(transportOptions.file),
    new winston.transports.Console(transportOptions.console),
  ],
  exitOnError: false,
};

const serverLogger = winston.createLogger(loggerConfig);

const loggerStream = {
  write: (message) => {
    serverLogger.info(message);
  },
};

const httpLogger = morgan('combined', {
  stream: loggerStream,
});

module.exports = {
  serverLogger,
  httpLogger,
};
