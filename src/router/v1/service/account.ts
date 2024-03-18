import { account as Account } from '@prisma/client';
import { appError, AppErrorSeverity } from '../../../lib/errors';
import { OrmClient } from '../../../db/orm';

export type AccountServiceResponse = Promise<Account | null>;

type AccountService = {
  getAccount: (orm: OrmClient, id: number) => AccountServiceResponse;
  createAccount: (orm: OrmClient, data: Omit<Account, 'id'>) => AccountServiceResponse;
  updateAccount: (orm: OrmClient, id: number, data: Partial<Account>) => AccountServiceResponse;
  deleteAccount: (orm: OrmClient, id: number) => AccountServiceResponse;
};

async function getAccount(orm: OrmClient, id: number): AccountServiceResponse {
  const account = await orm.account.get(id);

  if (!account) {
    throw appError(AppErrorSeverity.WARNING, 'Account service', `Account with id ${id} not found`);
  }

  return account;
}

async function createAccount(orm: OrmClient, data: Omit<Account, 'id'>): AccountServiceResponse {
  const account = await orm.account.create(data);

  if (!account) {
    throw appError(AppErrorSeverity.WARNING, 'Account service', `Account could not be created`);
  }

  return account;
}

async function updateAccount(
  orm: OrmClient,
  id: number,
  data: Partial<Account>
): AccountServiceResponse {
  const account = await orm.account.update(id, data);

  if (!account) {
    throw appError(AppErrorSeverity.WARNING, 'Account service', `Account could not be updated`);
  }

  return account;
}

async function deleteAccount(orm: OrmClient, id: number): AccountServiceResponse {
  const account = await orm.account.delete(id);

  if (!account) {
    throw appError(AppErrorSeverity.WARNING, 'Account service', `Account could not be deleted`);
  }

  return account;
}

export const accountService: AccountService = {
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
};
