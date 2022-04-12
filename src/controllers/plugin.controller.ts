import { Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import { get, del, getModelSchemaRef, param, post, requestBody } from '@loopback/rest';
import { Plugin } from '../models';
import { PluginRepository } from '../repositories';
import { convertPluginToCLT } from '../services/PolusToCLT';

export class PluginController {
  constructor(
    @repository(PluginRepository)
    public pluginRepository: PluginRepository,
  ) {}

  @post('/compute/plugins', {
    responses: {
      '200': {
        description: 'Plugins model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Plugin) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plugin, {
            title: 'NewScripts',
            exclude: ['id'],
          }),
        },
      },
    })
    plugin: Plugin,
  ): Promise<Plugin> {
    if (!plugin.cwlScript) {
      plugin.cwlScript = convertPluginToCLT(plugin);
    }
    return this.pluginRepository.create(plugin);
  }

  @get('/compute/plugins', {
    responses: {
      '200': {
        description: 'Plugin model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Plugin, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Plugin) filter?: Filter<Plugin>): Promise<Plugin[]> {
    return this.pluginRepository.find(filter);
  }

  @get('/compute/plugins/{id}', {
    responses: {
      '200': {
        description: 'Plugins model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Plugin, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string, @param.filter(Plugin, { exclude: 'where' }) filter?: FilterExcludingWhere<Plugin>): Promise<Plugin> {
    return this.pluginRepository.findById(id, filter);
  }
  @del('/compute/plugins/{id}', {
    responses: {
      '204': {
        description: 'Plugin DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pluginRepository.deleteById(id);
  }
}
