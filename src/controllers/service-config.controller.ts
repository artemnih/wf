import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, put, del, requestBody } from '@loopback/rest';
import { ServiceConfig } from '../models/service-config.model';
import { ServiceConfigRepository } from '../repositories/service-config.repository';

export class ServiceConfigController {
  constructor(
    @repository(ServiceConfigRepository)
    public serviceConfigRepository: ServiceConfigRepository,
  ) { }

  @post('/service-configs', {
    responses: {
      '200': {
        description: 'ServiceConfig model instance',
        content: { 'application/json': { schema: getModelSchemaRef(ServiceConfig) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceConfig, {
            title: 'NewServiceConfig',
            exclude: ['id'],
          }),
        },
      },
    })
    serviceConfig: Omit<ServiceConfig, 'id'>,
  ): Promise<ServiceConfig> {
    return this.serviceConfigRepository.create(serviceConfig);
  }

  @get('/service-configs/count', {
    responses: {
      '200': {
        description: 'ServiceConfig model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(@param.where(ServiceConfig) where?: Where<ServiceConfig>): Promise<Count> {
    return this.serviceConfigRepository.count(where);
  }

  @get('/service-configs', {
    responses: {
      '200': {
        description: 'Array of ServiceConfig model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ServiceConfig, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(ServiceConfig) filter?: Filter<ServiceConfig>): Promise<ServiceConfig[]> {
    return this.serviceConfigRepository.find(filter);
  }

  @patch('/service-configs', {
    responses: {
      '200': {
        description: 'ServiceConfig PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceConfig, { partial: true }),
        },
      },
    })
    serviceConfig: ServiceConfig,
    @param.where(ServiceConfig) where?: Where<ServiceConfig>,
  ): Promise<Count> {
    return this.serviceConfigRepository.updateAll(serviceConfig, where);
  }

  @get('/service-configs/{id}', {
    responses: {
      '200': {
        description: 'ServiceConfig model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ServiceConfig, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ServiceConfig, { exclude: 'where' }) filter?: FilterExcludingWhere<ServiceConfig>,
  ): Promise<ServiceConfig> {
    return this.serviceConfigRepository.findById(id, filter);
  }

  @patch('/service-configs/{id}', {
    responses: {
      '204': {
        description: 'ServiceConfig PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceConfig, { partial: true }),
        },
      },
    })
    serviceConfig: ServiceConfig,
  ): Promise<void> {
    await this.serviceConfigRepository.updateById(id, serviceConfig);
  }

  @put('/service-configs/{id}', {
    responses: {
      '204': {
        description: 'ServiceConfig PUT success',
      },
    },
  })
  async replaceById(@param.path.string('id') id: string, @requestBody() serviceConfig: ServiceConfig): Promise<void> {
    await this.serviceConfigRepository.replaceById(id, serviceConfig);
  }

  @del('/service-configs/{id}', {
    responses: {
      '204': {
        description: 'ServiceConfig DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.serviceConfigRepository.deleteById(id);
  }
}
