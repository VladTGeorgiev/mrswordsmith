import { Router } from 'express';
import NodeCache from 'node-cache';
import { validateSchema } from '../middleware/schema/validate';
import { getAccountController } from '../controller/account/get';
import { log } from '../middleware/logging/log';
import { createAccountController } from '../controller/account/create';
import { updateAccountController } from '../controller/account/update';
import { deleteAccountController } from '../controller/account/delete';
import { OrmClient } from '../../../db/orm';

export async function createAccountsRouter(
  router: Router,
  apiVersionPath: string,
  orm: OrmClient,
  cache: NodeCache
): Promise<{ router: Router; subPath: string }> {
  const accountsPath = '/account';
  const accountsFullPath = `${apiVersionPath}${accountsPath}`;

  router.post(``, [validateSchema(accountsFullPath), log], createAccountController(orm));

  router.get(
    `/:id`,
    [validateSchema(`${accountsFullPath}/:id`), log],
    getAccountController(`${accountsFullPath}/:id`, orm, cache)
  );

  router.patch(
    `/:id`,
    [validateSchema(`${accountsFullPath}/:id`), log],
    updateAccountController(orm)
  );

  router.delete(
    `/:id`,
    [validateSchema(`${accountsFullPath}/:id`), log],
    deleteAccountController(orm)
  );

  return { router, subPath: accountsPath };
}
