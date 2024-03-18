import { HTTPStatusCode, replyWithError, replyWithSuccess } from './apiResponse';

jest.mock('express');

describe('apiResponse', () => {
  let res: any;

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
  });

  describe('replyWithError function', () => {
    it('should reply with a default error message and status', () => {
      replyWithError(res);

      expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error',
        error: true,
        code: HTTPStatusCode.SERVER_ERROR,
        description: undefined,
      });
    });

    it('should reply with a custom error message and status', () => {
      const customMessage = 'Custom error message';
      const customStatusCode = HTTPStatusCode.BAD_REQUEST;

      replyWithError(res, customMessage, customStatusCode);

      expect(res.status).toHaveBeenCalledWith(customStatusCode);
      expect(res.json).toHaveBeenCalledWith({
        message: customMessage,
        error: true,
        code: customStatusCode,
        description: undefined,
      });
    });

    it('should reply with an error message, status and description', () => {
      const customMessage = 'Custom error message';
      const customStatusCode = HTTPStatusCode.BAD_REQUEST;
      const customDescription = 'Custom description';

      replyWithError(res, customMessage, customStatusCode, customDescription);

      expect(res.status).toHaveBeenCalledWith(customStatusCode);
      expect(res.json).toHaveBeenCalledWith({
        message: customMessage,
        error: true,
        code: customStatusCode,
        description: customDescription,
      });
    });
  });

  describe('replyWithSuccess function', () => {
    it('should correctly set statusCode and payload', () => {
      replyWithSuccess(res, 'Successful operation', HTTPStatusCode.OK, {});

      expect(res.status).toHaveBeenCalledWith(HTTPStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successful operation',
        error: false,
        code: HTTPStatusCode.OK,
        data: {},
      });
    });
  });
});
