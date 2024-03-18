import logger from './logger';

export type AppError = {
  name: string;
  severity: AppErrorSeverity;
  context: string;
  message: string;
};

export enum AppErrorSeverity {
  INFO = 'Info',
  WARNING = 'Warning',
  CRITICAL = 'Critical',
}

function logAppError(appError: AppError, stack: string | undefined) {
  const { context, severity, message } = appError;

  switch (severity) {
    case AppErrorSeverity.INFO:
      logger.info(context, message);
      break;

    case AppErrorSeverity.WARNING:
      logger.warn(context, message);
      break;

    case AppErrorSeverity.CRITICAL:
      logger.error(context, stack || message);
      break;

    default:
      logger.error(context, stack || message);
  }
}

export function appError(severity: AppErrorSeverity, context: string, message: string): AppError {
  const error: Error = new Error(message);
  const appError: AppError = {
    name: 'AppError',
    severity,
    context,
    message,
  };

  logAppError(appError, error.stack);

  return appError;
}
