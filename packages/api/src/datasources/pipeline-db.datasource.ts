import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
require('dotenv').config();
const config = require('config');

const pipelineConfig = {
  name: 'PipelineDb',
  connector: 'mongodb',
  url: '',
  host: config.compute.db.url,
  port: config.compute.db.port,
  user: config.compute.db.username,
  password: config.compute.db.password,
  database: 'pipelinedb',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PipelineDbDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'PipelineDb';
  static readonly defaultConfig = pipelineConfig;

  constructor(
    @inject('datasources.config.PipelineDb', { optional: true })
    dsConfig: object = pipelineConfig,
  ) {
    super(dsConfig);
  }
}
