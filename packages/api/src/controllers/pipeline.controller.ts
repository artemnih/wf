import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import { del, get, getModelSchemaRef, patch, param, post, requestBody, HttpErrors } from '@loopback/rest';
import { Pipeline } from '../models';
import { PipelineRepository } from '../repositories';
import { authenticate } from '@labshare/services-auth';

@authenticate()
export class PipelineController {
  constructor(
    @repository(PipelineRepository)
    public pipelineRepository: PipelineRepository,
  ) {}

  @post('/compute/pipelines', {
    responses: {
      '200': {
        description: 'Workflow model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Pipeline) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pipeline, {
            title: 'NewPipeline',
          }),
        },
      },
    })
    pipeline: Pipeline,
  ): Promise<Pipeline> {
    const pipelineExist = await this.pipelineRepository.checkIfPipelineExists(pipeline.name, pipeline.version);
    if (!pipelineExist) {
      return this.pipelineRepository.create(pipeline);
    } else {
      throw new HttpErrors.UnprocessableEntity(`A Pipeline with name ${pipeline.name} and version ${pipeline.version} already exists.`);
    }
  }
  @get('/compute/pipelines', {
    responses: {
      '200': {
        description: 'Pipeline model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Pipeline, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Pipeline) filter?: Filter<Pipeline>): Promise<Pipeline[]> {
    return this.pipelineRepository.find(filter);
  }

  @get('/compute/pipelines/{id}', {
    responses: {
      '200': {
        description: 'Pipeline model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Pipeline, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Pipeline, { exclude: 'where' }) filter?: FilterExcludingWhere<Pipeline>,
  ): Promise<Pipeline> {
    return this.pipelineRepository.findById(id, filter);
  }
  @patch('/compute/pipelines/{id}', {
    responses: {
      '204': {
        description: 'Workflows PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pipeline, { partial: true }),
        },
      },
    })
    pipeline: Pipeline,
  ): Promise<void> {
    await this.pipelineRepository.updateById(id, pipeline);
  }
  @del('/compute/pipelines/{id}', {
    responses: {
      '204': {
        description: 'pipeline DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pipelineRepository.deleteById(id);
  }
}
