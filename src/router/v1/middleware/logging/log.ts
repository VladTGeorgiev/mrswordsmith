import { NextFunction, Request, Response } from 'express';
import logger from '../../../../lib/logger';

export const log = function (req: Request, _res: Response, next: NextFunction) {
  const description = Object.keys(req.body).length ? JSON.stringify(req.body) : '';

  logger.info(
    'Accounts Router',
    `Received ${req.method} request to: ${req.originalUrl}`,
    description
  );
  next();
};
