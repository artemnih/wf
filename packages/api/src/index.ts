import { ExpressServer } from './server';
import ConfigService from './services/config.service';

// Load environment variables from .env file
require('dotenv').config();
const config = require('config');
ConfigService.config = config;

const server = new ExpressServer();
server.start();
console.log(`Server is running at http://127.0.0.1:${config.rest.port}${config.compute.basePath}`);
