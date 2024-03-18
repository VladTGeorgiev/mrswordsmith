import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    roots: ['<rootDir>/src', '<rootDir>/tasks'],
    testRegex: '.test.ts$',
    transform: {
      '^.+\\.(t)s$': 'ts-jest',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    silent: true,
  };
};
