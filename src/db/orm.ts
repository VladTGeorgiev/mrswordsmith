import logger from '../lib/logger';
import { account as Account, PrismaClient } from '@prisma/client';
import { AccountServiceResponse } from '../router/v1/service/account';
import { appError, AppErrorSeverity } from '../lib/errors';

export type OrmClient = {
  account: OrmAccount;
  connect: () => void;
  disconnect: () => void;
  checkDbConnection: () => Promise<number>;
};

type OrmAccount = {
  get: (id: number) => AccountServiceResponse;
  create: (data: Omit<Account, 'id'>) => AccountServiceResponse;
  update: (id: number, data: Partial<Account>) => AccountServiceResponse;
  delete: (id: number) => AccountServiceResponse;
};

export async function createOrmClient(): Promise<OrmClient> {
  const prisma = new PrismaClient();
  logger.info('Startup', `Database connected...`);

  const orm: OrmClient = {
    account: {
      get: async (id) =>
        prisma.account.findUnique({
          where: {
            id,
          },
        }),
      create: async (data) =>
        prisma.account.create({
          data,
        }),
      update: async (id, data) =>
        prisma.account.update({
          where: {
            id,
          },
          data,
        }),
      delete: async (id) =>
        prisma.account.delete({
          where: {
            id,
          },
        }),
    },
    connect: async () => prisma.$connect,
    disconnect: async () => prisma.$disconnect,
    checkDbConnection: async () => prisma.$executeRaw`SELECT 1`,
  };

  orm.connect();
  const dbAlive = await orm.checkDbConnection();

  if (dbAlive !== 1) {
    throw appError(AppErrorSeverity.CRITICAL, 'Database', 'Database connection failed!');
  }

  return orm;
}
