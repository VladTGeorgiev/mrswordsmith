import { createV1Router } from './router';
import NodeCache from 'node-cache';
import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import { DbClient } from '../../db';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { OrmClient } from '../../db/orm';

describe('V1 Router', () => {
  let mockOrm: OrmClient;
  let mockCache: NodeCache;
  let basePath: string;
  let router: express.Router;
  let version: string;

  beforeEach(() => {
    const mockOrm = {} as OrmClient;
    mockCache = new NodeCache();
    basePath = '/api';
  });

  it('should create a V1 Router with the correct version', async () => {
    const result = await createV1Router(mockOrm, mockCache, basePath);
    router = result.router;
    version = result.version;
    expect(version).toEqual('/v1');
  });
});
