import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { PluginDbDataSource } from '../datasources';
import { Plugin, PluginRelations } from '../models';

export class PluginRepository extends DefaultCrudRepository<Plugin, typeof Plugin.prototype.id, PluginRelations> {
  constructor(@inject('datasources.PluginDb') dataSource: PluginDbDataSource) {
    super(Plugin, dataSource);
  }
  async checkIfPluginExists(name: string, version: string): Promise<boolean> {
    const exists = await this.count({ name, version });
    return exists.count > 0;
  }
}
