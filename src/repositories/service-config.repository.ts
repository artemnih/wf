import { DefaultCrudRepository, WhereBuilder } from '@loopback/repository';
import { ServiceConfig } from '../models/service-config.model';
import { ComputeDSDataSource } from '../datasources/compute-ds.datasource';
import { inject } from '@loopback/core';
import { Utilities } from '../utils/utilities';

export class ServiceConfigRepository extends DefaultCrudRepository<ServiceConfig, typeof ServiceConfig.prototype.id> {
  constructor(@inject('datasources.ComputeDS') dataSource: ComputeDSDataSource) {
    super(ServiceConfig, dataSource);
  }

  public async getByTitle(serviceName: string) {
    // avoid hardcoding `user` property name
    const userPropName = Utilities.getPropertyName(ServiceConfig).title;

    // build where query
    const where = new WhereBuilder().eq(userPropName, serviceName).build();

    // find record
    return this.findOne({ where: where });
  }
}
