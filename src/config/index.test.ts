import { getConfig } from './index';
import type { Config } from './index';
import logger from '../lib/logger';

describe('config', () => {
  logger.configure();

  it('should throw an error when "envVariables" is not defined', () => {
    expect(() => getConfig(undefined as any)).toThrow('ENV variables not set!');
  });

  it('should throw an error when not all required "envVariables" are set', () => {
    const envVars = {
      HOST: 'host',
      PATH: 'path',
    };
    expect(() => getConfig(envVars as any)).toThrow(
      'Not all ENV variables were set, missing: PORT, HEALTH_PORT, DATABASE_URL, DATABASE_HEALTH_CHECK_SEC'
    );
  });

  it('should return a valid config when all required "envVariables" are set', () => {
    const envVars: Config = {
      PORT: 3001,
      HEALTH_PORT: 3002,
      DATABASE_URL: 'db_url',
      DATABASE_HEALTH_CHECK_SEC: 10,
    };
    const expectedConfig: Config = {
      PORT: 3001,
      HEALTH_PORT: 3002,
      DATABASE_URL: 'db_url',
      DATABASE_HEALTH_CHECK_SEC: 10,
    };
    expect(getConfig(envVars)).toEqual(expectedConfig);
  });
});
