import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
require('dotenv').config();
const config = require('config');

export const PluginConfig = {
  name: 'PluginDb',
  connector: 'mongodb',
  url: '',
  host: config.compute.db.url,
  port: config.compute.db.port,
  user: config.compute.db.username,
  password: config.compute.db.password,
  database: 'plugindb',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PluginDbDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'PluginDb';
  static readonly defaultConfig = PluginConfig;

  constructor(
    @inject('datasources.config.PluginDb', { optional: true })
    dsConfig: object = PluginConfig,
  ) {
    super(dsConfig);
  }
}
