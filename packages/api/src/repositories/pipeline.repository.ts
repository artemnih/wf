import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { PipelineDbDataSource } from '../datasources';
import { Pipeline, PipelineRelations } from '../models';

export class PipelineRepository extends DefaultCrudRepository<Pipeline, typeof Pipeline.prototype.id, PipelineRelations> {
  constructor(@inject('datasources.PipelineDb') dataSource: PipelineDbDataSource) {
    super(Pipeline, dataSource);
  }
  async checkIfPipelineExists(name: string, version: string): Promise<boolean> {
    const exists = await this.count({ name, version });
    return exists.count > 0;
  }
}
