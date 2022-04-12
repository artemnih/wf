import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { PipelineDbDataSource } from '../datasources';
import { Pipeline, PipelineRelations } from '../models';

export class PipelineRepository extends DefaultCrudRepository<Pipeline, typeof Pipeline.prototype.id, PipelineRelations> {
  constructor(@inject('datasources.PipelineDb') dataSource: PipelineDbDataSource) {
    super(Pipeline, dataSource);
  }
}
