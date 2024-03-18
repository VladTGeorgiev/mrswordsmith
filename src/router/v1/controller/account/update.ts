import { RequestHandler } from 'express';
import { HTTPStatusCode, replyWithError, replyWithSuccess } from '../../../utils/apiResponse';
import { accountService } from '../../service/account';
import { OrmClient } from '../../../../db/orm';

export const updateAccountController = (orm: OrmClient): RequestHandler => {
  return async (req, res, next) => {
    const { id } = req.params;

    try {
      const account = await accountService.updateAccount(orm, Number(id), req.body);

      replyWithSuccess(res, 'Account updated', HTTPStatusCode.ACCEPTED, account);
    } catch (error) {
      const err = error as Error;
      if (err.name === 'AppError') {
        replyWithError(
          res,
          `Account could not be updated`,
          HTTPStatusCode.NOT_MODIFIED,
          err.message
        );
      } else {
        next(error);
      }
    }
  };
};
