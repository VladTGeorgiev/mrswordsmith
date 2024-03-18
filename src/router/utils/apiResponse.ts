import { Response } from 'express';

export enum HTTPStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

type BaseResponse = {
  message: string;
  error: boolean;
  code: HTTPStatusCode;
};

interface SuccessResponse<T> extends BaseResponse {
  data: T;
}

interface ErrorResponse<T> extends BaseResponse {
  description?: T;
}

export function replyWithError<T>(
  res: Response,
  message: string = 'Error',
  statusCode: HTTPStatusCode = HTTPStatusCode.SERVER_ERROR,
  description?: T
) {
  const payload: ErrorResponse<T> = {
    message,
    error: true,
    code: statusCode,
    description,
  };
  res.status(statusCode).json(payload);
}

export function replyWithSuccess<T>(
  res: Response,
  message: string = 'Successful operation',
  statusCode: HTTPStatusCode = HTTPStatusCode.OK,
  data: T
) {
  const payload: SuccessResponse<T> = {
    message,
    error: false,
    code: statusCode,
    data,
  };
  res.status(statusCode).json(payload);
}
