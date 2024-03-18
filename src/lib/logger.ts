import { createLogger, Logger as WinstonLogger, transports, format, addColors } from 'winston';

const logLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
  },
};

let logger: WinstonLogger;

function configure() {
  addColors(logLevels.colors);
  logger = createLogger({
    levels: logLevels.levels,
    transports: [
      new transports.Console({
        level: 'debug',
        format: format.combine(
          format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          format.printf((data) => {
            return `${data.timestamp} [${data.level.toUpperCase()}] | ${data.context} | ${data.message} ${(data as any).description ? '| ' + (data as any).description : ''}`;
          }),
          format.colorize({ all: true })
        ),
      }),
    ],
  });
}

const logLevel = (level: string) => (context: string, message: string, description?: string) => {
  if (!logger) {
    throw new Error('Logger is not configured!');
  }
  logger.log({ level, context, message, description });
};

export default {
  configure,
  fatal: logLevel('fatal'),
  error: logLevel('error'),
  warn: logLevel('warn'),
  info: logLevel('info'),
  debug: logLevel('debug'),
};
