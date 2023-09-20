import { ExpressServer } from './server';

require('dotenv').config();
const config = require('config');
const server = new ExpressServer(config);
server.start();
console.log(`Server is running at http://127.0.0.1:${config.rest.port}${config.slurmCompute.basePath}`);

