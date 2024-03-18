import { describe, expect, it } from '@jest/globals';
import { appError, AppErrorSeverity } from './errors';
import logger from './logger';

describe('appError function', () => {
  logger.configure();

  const context = 'Test Context';
  const message = 'Test Message';

  const expectedResult = (severity: AppErrorSeverity) => {
    return {
      name: 'AppError',
      severity,
      context,
      message,
    };
  };

  it('should correctly create an appError with severity INFO, context and message', () => {
    const severity: AppErrorSeverity = AppErrorSeverity.INFO;
    const error = appError(severity, context, message);

    expect(error).toEqual(expectedResult(severity));
  });

  it('should correctly create an appError with severity WARNING, context and message 3', () => {
    const severity: AppErrorSeverity = AppErrorSeverity.WARNING;
    const error = appError(severity, context, message);

    expect(error).toEqual(expectedResult(severity));
  });

  it('should correctly create an appError with severity CRITICAL, context and message 4', () => {
    const severity: AppErrorSeverity = AppErrorSeverity.CRITICAL;
    const error = appError(severity, context, message);

    expect(error).toEqual(expectedResult(severity));
  });
});
