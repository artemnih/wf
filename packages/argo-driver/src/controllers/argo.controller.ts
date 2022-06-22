import {repository} from '@loopback/repository';
import {
  post,
  param,
  getModelSchemaRef,
  requestBody,
  get,
  put,
  ResponseObject,
} from '@loopback/rest';
import {Argo} from '../models';
import {ArgoRepository} from '../repositories';
import {CwlWorkflow, MinimalJob} from '../types';
import {
  statusOfArgoWorkflow,
  ArgoWorkflowStatus,
  getArgoJobsAndUpdateComputeJobs,
  stopArgoWorkflow,
} from '../services/argoApi';
import {getTargetFromJobs} from '../services';
import {Target} from '../services/getTargetFromJobs';
import {authenticate} from '@labshare/services-auth';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

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
export class ArgoController {
  constructor(
    @repository(ArgoRepository)
    public argoRepository: ArgoRepository,
  ) {}
  @post('/compute/argo', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Argo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Argo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Argo, {
            title: 'NewArgoCompute',
            exclude: ['id'],
          }),
        },
      },
    })
    argo: Argo,
  ): Promise<void> {
    return this.argoRepository.compute(
      argo.cwlWorkflow as CwlWorkflow,
      argo.cwlJobInputs,
      argo.jobs as MinimalJob[],
    );
  }
  @get('/compute/argo/{id}/status', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': STATUS_RESPONSE,
    },
  })
  getWorkflowStatus(
    @param.path.string('id') id: string,
  ): Promise<ArgoWorkflowStatus> {
    return statusOfArgoWorkflow(id);
  }
  @get('/compute/argo/{id}/logs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowLogs(@param.path.string('id') id: string): Promise<object> {
    const jobs = await getArgoJobsAndUpdateComputeJobs(id);
    return getTargetFromJobs(jobs, Target.logs);
  }

  @get('/compute/argo/{id}/outputs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowOutputs(
    @param.path.string('id') id: string,
  ): Promise<object> {
    const jobs = await getArgoJobsAndUpdateComputeJobs(id);

    return getTargetFromJobs(jobs, Target.outputs);
  }
  @get('/compute/argo/{id}/jobs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowJobs(
    @param.path.string('id') id: string,
  ): Promise<MinimalJob[]> {
    return getArgoJobsAndUpdateComputeJobs(id);
  }
  @put('/compute/argo/{id}/stop', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': 'Workflow stopped',
    },
  })
  stopWorkflow(@param.path.string('id') id: string): Promise<void> {
    return stopArgoWorkflow(id);
  }
}
