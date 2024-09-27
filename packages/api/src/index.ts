import { ExpressServer } from './server';
import ConfigService from './services/config.service';
import { logger } from './utils';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load environment variables from .env file
require('dotenv').config();
const config = require('config');
ConfigService.setConfig(config);

const server = new ExpressServer();
server.start();
logger.info(`Server is running at http://127.0.0.1:${config.rest.port}${config.compute.basePath}`);
