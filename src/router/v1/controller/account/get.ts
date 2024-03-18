import NodeCache from 'node-cache';
import { RequestHandler } from 'express';
import { account as Account } from '@prisma/client';
import { HTTPStatusCode, replyWithError, replyWithSuccess } from '../../../utils/apiResponse';
import { accountService } from '../../service/account';
import { OrmClient } from '../../../../db/orm';

export const getAccountController = (
  path: string,
  orm: OrmClient,
  cache: NodeCache
): RequestHandler => {
  return async (req, res, next) => {
    const { id } = req.params;

    try {
      const cacheKey = `${path}/${id}`;
      const cachedResponse = cache.get<Account>(cacheKey);

      if (cachedResponse) {
        replyWithSuccess(res, 'Account fetched', HTTPStatusCode.OK, cachedResponse);
        return;
      }

      const account = await accountService.getAccount(orm, Number(id));

      cache.set(cacheKey, account);

      replyWithSuccess(res, 'Account fetched', HTTPStatusCode.OK, account);
    } catch (error) {
      const err = error as Error;
      if (err.name === 'AppError') {
        replyWithError(
          res,
          `Account could not be retrieved`,
          HTTPStatusCode.NOT_FOUND,
          err.message
        );
      } else {
        next(error);
      }
    }
  };
};
