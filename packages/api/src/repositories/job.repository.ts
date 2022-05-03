import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { JobDbDataSource } from '../datasources';
import { Job, JobRelations } from '../models';

export class JobRepository extends DefaultCrudRepository<Job, typeof Job.prototype.id, JobRelations> {
  constructor(@inject('datasources.JobDb') dataSource: JobDbDataSource) {
    super(Job, dataSource);
  }
}
