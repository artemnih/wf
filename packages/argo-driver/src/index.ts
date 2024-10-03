import { CONFIG } from './config';
import { ExpressServer } from './server';
import { logger } from './services/logger';

const server = new ExpressServer(CONFIG);
server.start();
logger.info(`Server is running at http://127.0.0.1:${CONFIG.rest.port}`);
