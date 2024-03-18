import { account as Account } from '@prisma/client';
import { accountService } from './account';
import { createOrmClient, OrmClient } from '../../../db/orm';

const exampleResponse = {
  id: 7,
  name: 'sdafasdff',
  email: 'e@mail.com',
  phone: 'c',
  address: 'c',
};

const mockOrmClient: OrmClient = {
  account: {
    get: jest.fn(() => Promise.resolve(exampleResponse)),
    create: jest.fn(() => Promise.resolve(exampleResponse)),
    update: jest.fn(() => Promise.resolve(exampleResponse)),
    delete: jest.fn(() => Promise.resolve(exampleResponse)),
  },
  connect: jest.fn(),
  disconnect: jest.fn(),
  checkDbConnection: jest.fn(() => Promise.resolve(1)),
};

jest.mock('../../../db/orm', () => ({
  createOrmClient: jest.fn(() => Promise.resolve(mockOrmClient)),
}));

describe('account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('returns account when valid id is provided', async () => {
      const mockAccount: Omit<Account, 'id'> = {
        name: 'Test Account',
        email: 'email',
        phone: 'phone',
        address: 'address',
      };

      await createOrmClient();
      mockOrmClient.account.create = jest.fn().mockResolvedValue(mockAccount);

      const result = await accountService.createAccount(mockOrmClient, mockAccount);

      expect(result).toEqual(mockAccount);
      expect(mockOrmClient.account.create).toHaveBeenCalledWith(mockAccount);
    });

    it("throws error when if account couldn't be created", async () => {
      mockOrmClient.account.create = jest.fn().mockResolvedValue(null);

      await expect(
        accountService.createAccount(mockOrmClient, {
          name: 'name',
        } as any)
      ).rejects.toThrow();
      expect(mockOrmClient.account.create).toHaveBeenCalledWith({ name: 'name' });
    });
  });

  describe('get', () => {
    it('returns account when valid id is provided', async () => {
      const mockAccount = { id: 1, name: 'Test Account' };
      mockOrmClient.account.get = jest.fn().mockResolvedValue(mockAccount);

      const result = await accountService.getAccount(mockOrmClient, 1);

      expect(result).toEqual(mockAccount);
      expect(mockOrmClient.account.get).toHaveBeenCalledWith(1);
    });

    it('throws error when account with provided id is not found', async () => {
      mockOrmClient.account.get = jest.fn().mockResolvedValue(null);

      await expect(accountService.getAccount(mockOrmClient, 2)).rejects.toThrow();
      expect(mockOrmClient.account.get).toHaveBeenCalledWith(2);
    });
  });

  describe('update', () => {
    it('returns account after update', async () => {
      const mockAccount: Partial<Account> = {
        name: 'Test Account',
      };
      mockOrmClient.account.update = jest.fn().mockResolvedValue(mockAccount);

      const result = await accountService.updateAccount(mockOrmClient, 1, mockAccount);

      expect(result).toEqual(mockAccount);
      expect(mockOrmClient.account.update).toHaveBeenCalledWith(1, { name: 'Test Account' });
    });

    it("throws error when if account couldn't be updated", async () => {
      mockOrmClient.account.update = jest.fn().mockResolvedValue(null);

      await expect(
        accountService.updateAccount(mockOrmClient, 1, {
          name: 'name',
        } as any)
      ).rejects.toThrow();
      expect(mockOrmClient.account.update).toHaveBeenCalledWith(1, { name: 'name' });
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns account after deletion', async () => {
      const mockAccount: Partial<Account> = {
        name: 'Test Account',
      };
      mockOrmClient.account.delete = jest.fn().mockResolvedValue(mockAccount);

      const result = await accountService.deleteAccount(mockOrmClient, 1);

      expect(result).toEqual(mockAccount);
      expect(mockOrmClient.account.delete).toHaveBeenCalledWith(1);
    });

    it("throws error when account couldn't be deleted", async () => {
      mockOrmClient.account.delete = jest.fn().mockResolvedValue(null);

      await expect(accountService.deleteAccount(mockOrmClient, 1)).rejects.toThrow();
      expect(mockOrmClient.account.delete).toHaveBeenCalledWith(1);
    });
  });
});
