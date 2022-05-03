import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import { get, getModelSchemaRef, param, post, requestBody, patch } from '@loopback/rest';
import { Job } from '../models';
import { JobRepository } from '../repositories';
import { authenticate } from '@labshare/services-auth';


@authenticate()
export class JobController {
  constructor(
    @repository(JobRepository)
    public jobRepository: JobRepository,
  ) {}

  @post('/compute/jobs', {
    responses: {
      '200': {
        description: 'Job model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Job) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, {
            title: 'NewJob',
            exclude: ['id', 'status', 'dateCreated'],
          }),
        },
      },
    })
    job: Job,
  ): Promise<Job> {
    return this.jobRepository.create(job);
  }

  @get('/compute/jobs', {
    responses: {
      '200': {
        description: 'Job model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Job, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Job) filter?: Filter<Job>): Promise<Job[]> {
    return this.jobRepository.find(filter);
  }

  @get('/compute/jobs/{id}', {
    responses: {
      '200': {
        description: 'Job model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Job, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string, @param.filter(Job, { exclude: 'where' }) filter?: FilterExcludingWhere<Job>): Promise<Job> {
    return this.jobRepository.findById(id, filter);
  }
  @patch('/compute/jobs/{id}', {
    responses: {
      '204': {
        description: 'Jobs PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, { partial: true }),
        },
      },
    })
    job: Job,
  ): Promise<void> {
    await this.jobRepository.updateById(id, job);
  }
}
