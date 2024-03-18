import { Request, Response, NextFunction } from 'express';
import { log } from './log';
import logger from '../../../../lib/logger';

describe('log', () => {
  logger.configure();

  it('logs the request properly with description', () => {
    const reqMock = {
      body: { key: 'value' },
      method: 'GET',
      originalUrl: '/api/v1/some-endpoint',
    } as unknown as Request;

    const resMock = {} as unknown as Response;
    const nextFunctionMock = jest.fn() as unknown as NextFunction;

    const loggerInfoSpy = jest.spyOn(logger, 'info');

    log(reqMock, resMock, nextFunctionMock);

    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'Accounts Router',
      `Received ${reqMock.method} request to: ${reqMock.originalUrl}`,
      JSON.stringify(reqMock.body)
    );
    expect(nextFunctionMock).toHaveBeenCalledTimes(1);

    loggerInfoSpy.mockRestore();
  });

  it('logs the request properly without description', () => {
    const reqMock = {
      body: {},
      method: 'GET',
      originalUrl: '/api/v1/some-other-endpoint',
    } as unknown as Request;

    const resMock = {} as unknown as Response;
    const nextFunctionMock = jest.fn() as unknown as NextFunction;

    const loggerInfoSpy = jest.spyOn(logger, 'info');

    log(reqMock, resMock, nextFunctionMock);

    expect(loggerInfoSpy).toHaveBeenCalledWith(
      'Accounts Router',
      `Received ${reqMock.method} request to: ${reqMock.originalUrl}`,
      ''
    );
    expect(nextFunctionMock).toHaveBeenCalledTimes(1);

    loggerInfoSpy.mockRestore();
  });
});
