import { RequestHandler } from 'express';
import { HTTPStatusCode, replyWithError, replyWithSuccess } from '../../../utils/apiResponse';
import { accountService } from '../../service/account';
import { OrmClient } from '../../../../db/orm';

export const deleteAccountController = (orm: OrmClient): RequestHandler => {
  return async (req, res, next) => {
    const { id } = req.params;

    try {
      const account = await accountService.deleteAccount(orm, Number(id));

      replyWithSuccess(res, 'Account deleted', HTTPStatusCode.ACCEPTED, account);
    } catch (error) {
      const err = error as Error;
      if (err.name === 'AppError') {
        replyWithError(
          res,
          `Account could not be deleted`,
          HTTPStatusCode.NOT_MODIFIED,
          err.message
        );
      } else {
        next(error);
      }
    }
  };
};
