import { NextFunction } from 'express';
import { validateSchema } from './validate';
import logger from '../../../../lib/logger';

describe('validateSchema function', () => {
  logger.configure();
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      send: jest.fn().mockReturnThis(),
      // @ts-ignore
      status: jest.fn().mockReturnThis(),
    };
  });

  it('Asserts error for non existent schema path', async () => {
    try {
      validateSchema('non-existent-path')(mockRequest as any, mockResponse as any, nextFunction);
    } catch (err: any) {
      expect(err).toEqual({
        name: 'AppError',
        severity: 'Critical',
        context: 'Request validation',
        message: 'No schema found for path: non-existent-path',
      });
    }
  });

  it('Should skip validation for non-allowed methods', async () => {
    // @ts-ignore
    mockRequest.method = 'POST';
    validateSchema('/api/v1/account/:id')(mockRequest as any, mockResponse as any, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
