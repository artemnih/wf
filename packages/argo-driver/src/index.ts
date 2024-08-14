import { ExpressServer } from './server';
import { logger } from './services/logger';

require('dotenv').config();
const config = require('config');
const server = new ExpressServer(config);
server.start();
logger.info(`Server is running at http://127.0.0.1:${config.rest.port}${config.argoCompute.basePath}`);
