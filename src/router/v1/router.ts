import NodeCache from 'node-cache';
import { Router } from 'express';
import { createAccountsRouter } from './routes/account';
import { OrmClient } from '../../db/orm';

export async function createV1Router(
  orm: OrmClient,
  cache: NodeCache,
  basePath: string
): Promise<{ router: Router; version: string }> {
  const router = Router();
  const version = '/v1';
  const apiVersionPath = `${basePath}${version}`;

  const accountsRouter = await createAccountsRouter(router, apiVersionPath, orm, cache);

  router.use(`${accountsRouter.subPath}`, accountsRouter.router);

  return { router, version };
}
