import 'dotenv/config';
import process from 'process';
import { createLightship } from 'lightship';
import { getConfig } from './config';
import { createDbClient } from './db';
import { initApp } from './app';
import logger from './lib/logger';

async function runService() {
  logger.configure();
  logger.info('Startup', 'Starting Accounting service...');

  const config = getConfig(process.env);

  const lightship = await createLightship({
    port: config.HEALTH_PORT,
    shutdownHandlerTimeout: 10_000,
  });

  const dbClient = await createDbClient(config, lightship);

  await initApp(config, dbClient.orm);

  lightship.registerShutdownHandler(async () => {
    logger.info('Shutdown', `Server starting shutdown sequence...`);
    clearInterval(dbClient.healthCheckIntervalRef);

    dbClient.orm.disconnect();
    logger.info('Shutdown', `Database disconnected!`);
  });
}

runService().catch(async (e) => {
  logger.error('Startup', `Starting Accounting app failed! ${e}`);
  process.exit(1);
});
