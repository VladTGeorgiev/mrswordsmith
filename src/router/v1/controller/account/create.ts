import { RequestHandler } from 'express';
import { HTTPStatusCode, replyWithError, replyWithSuccess } from '../../../utils/apiResponse';
import { accountService } from '../../service/account';
import { OrmClient } from '../../../../db/orm';

export const createAccountController = (orm: OrmClient): RequestHandler => {
  return async (req, res, next) => {
    try {
      const account = await accountService.createAccount(orm, req.body);

      replyWithSuccess(res, 'Account created', HTTPStatusCode.CREATED, account);
    } catch (error) {
      const err = error as Error;

      if (err.name === 'AppError') {
        replyWithError(
          res,
          `Account could not be created`,
          HTTPStatusCode.SERVER_ERROR,
          err.message
        );
      } else {
        next(error);
      }
    }
  };
};
