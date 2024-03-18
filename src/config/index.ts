import logger from '../lib/logger';

export type Config = {
  PORT: number;
  HEALTH_PORT: number;
  DATABASE_URL: string;
  DATABASE_HEALTH_CHECK_SEC: number;
};

const requiredKeys = ['PORT', 'HEALTH_PORT', 'DATABASE_URL', 'DATABASE_HEALTH_CHECK_SEC'] as const;
type RequiredKey = (typeof requiredKeys)[number];

const parseConfig = (config: any): Partial<Config> => {
  return Object.entries(config).reduce((acc, [key, value]) => {
    if (!value) return acc;
    const port = parseInt(value as string);

    switch (key) {
      case 'DATABASE_URL':
        acc[key] = value as string;
        break;
      case 'PORT':
      case 'HEALTH_PORT':
      case 'DATABASE_HEALTH_CHECK_SEC':
        if (!isNaN(port)) {
          acc[key] = port;
        }
        break;
    }

    return acc;
  }, {} as Partial<Config>);
};

const validateConfig = (config: Partial<Config>) => {
  const missingKeys = requiredKeys.filter((key: RequiredKey) => !config[key]);

  if (missingKeys.length > 0) {
    const message = `Not all ENV variables were set, missing: ${missingKeys.join(', ')}`;
    logger.error('Startup', message);
    throw new Error(message);
  }
};

export const getConfig = (envVariables: any): Config => {
  if (!envVariables) throw new Error('ENV variables not set!');

  const config = parseConfig(envVariables);
  validateConfig(config);
  logger.info('Startup', 'Config OK...');

  return config as Config;
};
