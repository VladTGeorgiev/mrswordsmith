import NodeCache from 'node-cache';
import supertest from 'supertest';
import { AppErrorSeverity } from '../../../lib/errors';
import { initTestApp } from '../../../test/helpers';
import { accountService } from '../service/account';
import { OrmClient } from '../../../db/orm';

jest.mock('../service/account');

describe('Accounts router', () => {
  const mockOrm: OrmClient = {} as OrmClient;
  let healthCheckIntervalRef: NodeJS.Timeout;
  const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

  beforeEach(() => {
    healthCheckIntervalRef = setInterval(() => {}, 1000);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cache.flushAll();
    clearInterval(healthCheckIntervalRef);
  });

  describe('get', () => {
    it('should return 200 when account is found', async () => {
      const mockAccount = {
        id: 1,
      };
      (accountService.getAccount as jest.Mock).mockResolvedValueOnce(mockAccount);

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.get(`/api/v1/account/1`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        code: 200,
        data: {
          id: 1,
        },
        error: false,
        message: 'Account fetched',
      });
    });

    it('should utilise cache', async () => {
      const id = 2;
      const mockAccount = {
        id: 2,
      };
      (accountService.getAccount as jest.Mock).mockResolvedValueOnce(mockAccount);

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      await request.get(`/api/v1/account/${id}`);
      await request.get(`/api/v1/account/${id}`);

      expect(cache.get(`/api/v1/account/:id/${id}`)).toEqual(mockAccount);
    });

    it('should return 404 when an account could not be found', async () => {
      const id = 3;
      (accountService.getAccount as jest.Mock).mockRejectedValue({
        name: 'AppError',
        severity: AppErrorSeverity.WARNING,
        context: 'Account service',
        message: `Account with id ${id} not found`,
      });

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.get(`/api/v1/account/${id}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        message: 'Account could not be retrieved',
        error: true,
        code: 404,
        description: `Account with id ${id} not found`,
      });
    });

    it('should return 400 when an incorrect value is passed', async () => {
      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.get(`/api/v1/account/incorrectValue`);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        message: 'Validation Error',
        error: true,
        code: 400,
        description: [
          {
            context: {
              key: 'id',
              label: 'id',
              value: 'incorrectValue',
            },
            message: '"id" must be a number',
            path: ['id'],
            type: 'number.base',
          },
        ],
      });
    });

    it('should return 500 when an unexpected error occurs', async () => {
      const id = 3;
      (accountService.getAccount as jest.Mock).mockRejectedValue({
        name: 'Error',
      });

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.get(`/api/v1/account/${id}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({});
    });
  });

  describe('create', () => {
    it('should return 201 when account is created', async () => {
      const mockAccount = {
        name: 'c',
        email: 'b@mail.com',
        phone: 'c',
        address: 'c',
      };
      (accountService.createAccount as jest.Mock).mockResolvedValueOnce(mockAccount);

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.post(`/api/v1/account`).send(mockAccount);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        code: 201,
        data: {
          address: 'c',
          email: 'b@mail.com',
          name: 'c',
          phone: 'c',
        },
        error: false,
        message: 'Account created',
      });
    });

    it('should return 400 when an incorrect value is passed', async () => {
      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.post(`/api/v1/account`).send({
        name: 'c',
        email: 'c',
        phone: 'c',
        address: 'c',
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        code: 400,
        description: [
          {
            context: {
              invalids: ['c'],
              key: 'email',
              label: 'email',
              value: 'c',
            },
            message: '"email" must be a valid email',
            path: ['email'],
            type: 'string.email',
          },
        ],
        error: true,
        message: 'Validation Error',
      });
    });

    it('should return 500 when an unexpected error occurs', async () => {
      const id = 3;
      (accountService.createAccount as jest.Mock).mockRejectedValue({
        name: 'Error',
      });

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.post(`/api/v1/account`).send({
        address: 'c',
        email: 'b@mail.com',
        name: 'c',
        phone: 'c',
      });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({});
    });
  });

  describe('update', () => {
    it('should return 202 when account is updated', async () => {
      const mockAccount = {
        name: 'c',
        email: 'b@mail.com',
        phone: 'c',
        address: 'c',
      };
      (accountService.updateAccount as jest.Mock).mockResolvedValueOnce(mockAccount);

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.patch(`/api/v1/account/1`).send(mockAccount);

      expect(res.status).toBe(202);
      expect(res.body).toEqual({
        code: 202,
        data: {
          address: 'c',
          email: 'b@mail.com',
          name: 'c',
          phone: 'c',
        },
        error: false,
        message: 'Account updated',
      });
    });

    it('should return 500 when an unexpected error occurs', async () => {
      (accountService.updateAccount as jest.Mock).mockRejectedValue({
        name: 'Error',
      });

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.patch(`/api/v1/account/3`).send({
        address: 'c',
        email: 'b@mail.com',
        name: 'c',
        phone: 'c',
      });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({});
    });
    it('should return 304 when an unexpected error occurs', async () => {
      (accountService.updateAccount as jest.Mock).mockRejectedValue({
        name: 'AppError',
      });

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.patch(`/api/v1/account/3`).send({
        address: 'c',
        email: 'b@mail.com',
        name: 'c',
        phone: 'c',
      });

      expect(res.status).toBe(304);
      expect(res.body).toEqual({});
    });
  });

  describe('delete', () => {
    it('should return 202 when account is updated', async () => {
      const mockAccount = {
        name: 'c',
        email: 'b@mail.com',
        phone: 'c',
        address: 'c',
      };
      (accountService.deleteAccount as jest.Mock).mockResolvedValueOnce(mockAccount);

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.delete(`/api/v1/account/1`);

      expect(res.status).toBe(202);
      expect(res.body).toEqual({
        code: 202,
        data: {
          address: 'c',
          email: 'b@mail.com',
          name: 'c',
          phone: 'c',
        },
        error: false,
        message: 'Account deleted',
      });
    });

    it('should return 304 when an could not delete', async () => {
      (accountService.deleteAccount as jest.Mock).mockRejectedValue({
        name: 'AppError',
      });

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.delete(`/api/v1/account/3`);

      expect(res.status).toBe(304);
      expect(res.body).toEqual({});
    });

    it('should return 500 when an unexpected error occurs', async () => {
      (accountService.deleteAccount as jest.Mock).mockRejectedValue({
        name: 'Error',
      });

      const app = await initTestApp(mockOrm, cache);

      const request = supertest(app);

      const res = await request.delete(`/api/v1/account/3`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({});
    });
  });
});
