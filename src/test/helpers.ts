import NodeCache from 'node-cache';
import express from 'express';
import bodyParser from 'body-parser';
import { createV1Router } from '../router/v1/router';
import logger from '../lib/logger';
import { OrmClient } from '../db/orm';

export async function initTestApp(orm: OrmClient, cache: NodeCache) {
  logger.configure();
  const app = express();
  const basePath = '/api';

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  const v1Router = await createV1Router(orm, cache, basePath);
  app.use(`${basePath}${v1Router.version}`, v1Router.router);

  return app;
}
