import { DefaultCrudRepository } from '@loopback/repository';
import { ServiceConfig, ServiceConfigRelations } from '../models/service-config.model';
import { ComputeDSDataSource } from '../datasources/compute-ds.datasource';
import { inject } from '@loopback/core';

export class ServiceConfigRepository extends DefaultCrudRepository<ServiceConfig, typeof ServiceConfig.prototype.id, ServiceConfigRelations> {
  constructor(@inject('datasources.ComputeDS') dataSource: ComputeDSDataSource) {
    super(ServiceConfig, dataSource);
  }
}
