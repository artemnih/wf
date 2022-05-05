import {authenticate} from '@labshare/services-auth';
import {repository} from '@loopback/repository';
import {
  getModelSchemaRef,
  get,
  param,
  post,
  requestBody,
  ResponseObject,
  put,
} from '@loopback/rest';
import {HpcCli, JobHPC, SlurmCli, toilKillHandler} from '../hpc';
import {Slurm} from '../models';
import {SlurmRepository} from '../repositories';
import {WorkflowStatus} from '../types/workflowStatus';

const STATUS_RESPONSE: ResponseObject = {
  description: 'Workflow Status',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'WorkflowStatus',
        properties: {
          status: {type: 'string'},
          dateCreated: {type: 'string'},
          dateFinished: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

const LOGS_RESPONSE: ResponseObject = {
  description: 'Workflow Logs',
  content: {
    'application/json': {
      schema: {
        type: 'array',
        title: 'WorkflowLogs',
        properties: {
          status: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

@authenticate()
export class SlurmController {
  constructor(
    @repository(SlurmRepository)
    public slurmRepository: SlurmRepository,
  ) {}

  @post('/compute/slurm', {
    responses: {
      '200': {
        description: 'Slurm model instance',
        content: {'application/json': {schema: getModelSchemaRef(Slurm)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Slurm, {
            title: 'NewSlurmCompute',
            exclude: ['id'],
          }),
        },
      },
    })
    slurm: Slurm,
  ): Promise<void> {
    return this.slurmRepository.compute(
      slurm.cwlWorkflow,
      slurm.cwlJobInputs,
      slurm.jobs,
    );
  }
  @get('/compute/slurm/{id}/status', {
    responses: {
      '200': STATUS_RESPONSE,
    },
  })
  async getWorkflowStatus(
    @param.path.string('id') id: string,
  ): Promise<WorkflowStatus> {
    require('dotenv').config();
    const slurmConfig = require('config');

    return this.slurmRepository.getWorkflowStatus(
      `${slurmConfig.slurmCompute.data}/${id}.status.json`,
    );
  }
  @get('/compute/slurm/{id}/logs', {
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowLogs(@param.path.string('id') id: string): Promise<object> {
    return this.slurmRepository.getWorkflowLogs(id);
  }
  @get('/compute/slurm/{id}/outputs', {
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowOutputs(
    @param.path.string('id') id: string,
  ): Promise<object> {
    return this.slurmRepository.getWorkflowOutputs(id);
  }
  @get('/compute/slurm/{id}/jobs', {
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowJobs(
    @param.path.string('id') id: string,
    hpcCli: HpcCli = new SlurmCli(),
  ): Promise<object | JobHPC[]> {
    return this.slurmRepository.getWorkflowJobs(id, hpcCli);
  }
  @put('/compute/slurm/{id}/stop', {
    responses: {
      '200': 'Workflow stopped',
    },
  })
  async stopWorkflow(
    @param.path.string('id') id: string,
    hpcCli: HpcCli = new SlurmCli(),
    toilHandler = toilKillHandler,
  ): Promise<void> {
    return this.slurmRepository.stopWorkflow(id, hpcCli, toilHandler);
  }
}
