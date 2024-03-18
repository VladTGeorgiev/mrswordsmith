import { Lightship } from 'lightship';
import { Config } from '../config';
import { startHealthChecker } from './health';
import { createOrmClient, OrmClient } from './orm';

export type DbClient = {
  orm: OrmClient;
  healthCheckIntervalRef: NodeJS.Timeout;
};

export async function createDbClient(config: Config, lightship: Lightship): Promise<DbClient> {
  const orm = await createOrmClient();

  const healthCheckIntervalRef = startHealthChecker(config, lightship, orm);

  return { orm, healthCheckIntervalRef };
}
