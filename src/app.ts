import express from 'express';
import bodyParser from 'body-parser';
import { createV1Router } from './router/v1/router';
import NodeCache from 'node-cache';
import { OrmClient } from './db';
import { Config } from './config';
import logger from './lib/logger';
import { HTTPStatusCode } from './router/utils/apiResponse';

export async function initApp(config: Config, orm: OrmClient) {
  const app = express();
  const basePath = '/api';

  const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
  logger.info('Startup', 'Cache running...');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const v1Router = await createV1Router(orm, cache, basePath);
  app.use(`${basePath}${v1Router.version}`, v1Router.router);

  app.use((err: any, _req: any, res: any, next: any) => {
    if (!res.headersSent) {
      const message = err.message || 'An error occurred';
      res.status(HTTPStatusCode.SERVER_ERROR).json({ error: message });
    }

    return next();
  });

  app.listen(config.PORT, () =>
    logger.info('Startup', `Accounting service listening on port ${config.PORT}!`)
  );

  return app;
}
