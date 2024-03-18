import { Lightship } from 'lightship';
import { Config } from '../config';
import logger from '../lib/logger';
import { OrmClient } from './orm';

export function startHealthChecker(config: Config, lightship: Lightship, orm: OrmClient) {
  return setInterval(async () => {
    const dbAlive = await orm.checkDbConnection();

    if (dbAlive && !lightship.isServerReady()) {
      lightship.signalReady();
    }
    if (!dbAlive && lightship.isServerReady()) {
      logger.warn('Health checks', 'Database connection lost');
      lightship.signalNotReady();
    }
  }, config.DATABASE_HEALTH_CHECK_SEC * 1000);
}
