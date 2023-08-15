import { authenticate } from '@labshare/services-auth';
import { inject } from '@loopback/context';
import { DateType, Filter, FilterExcludingWhere, repository } from '@loopback/repository';
import { get, getModelSchemaRef, put, patch, param, post, requestBody, Request, RestBindings, ResponseObject } from '@loopback/rest';
import { Workflow } from '../models';
import { PipelineRepository, WorkflowRepository } from '../repositories';
import { createPipeline, workflowToPipeline } from '../services/workflowToPipeline';

const STATUS_RESPONSE: ResponseObject = {
  description: 'Workflow Status',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'WorkflowStatus',
        properties: {
          status: { type: 'string' },
          dateCreated: { type: 'string' },
          dateFinished: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

const LOGS_RESPONSE: ResponseObject = {
  description: 'Workflow Outputs',
  content: {
    'application/json': {
      schema: {
        type: 'array',
        title: 'WorkflowOutput',
        properties: {
          status: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

interface Status {
  status: string;
  dateFinished: string;
}
@authenticate()
export class WorkflowController {
  constructor(
    @repository(WorkflowRepository)
    public workflowRepository: WorkflowRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(PipelineRepository)
    public pipelineRepository: PipelineRepository,
  ) {}

  @post('/compute/workflows', {
    responses: {
      '200': {
        description: 'Workflow model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Workflow) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Workflow, {
            title: 'NewWorkflow',
            exclude: ['id', 'status', 'dateCreated'],
          }),
        },
      },
    })
    workflow: Workflow,
  ): Promise<Workflow> {
    console.log(this.req);
    workflow.dateCreated = new DateType().defaultValue().toISOString();
    const workflowCreated = await this.workflowRepository.create(workflow);
    await this.workflowRepository.submitWorkflowToDriver(
      workflowCreated,
      this.pipelineRepository,
      this.req.headers.authorization as string,
    );
    return workflowCreated;
  }
  @post('/compute/workflows/{id}/resubmit', {
    responses: {
      '200': {
        description: 'Workflow model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Workflow) } },
      },
    },
  })
  async resubmitWorkflow(
    @param.path.string('id')
    id: string,
  ): Promise<Workflow> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    foundWorkflow.id = undefined;
    const newWorkflow = await this.workflowRepository.create(foundWorkflow);
    await this.workflowRepository.resubmitWorkflow(newWorkflow, this.req.headers.authorization as string);
    return newWorkflow;
  }

  @get('/compute/workflows', {
    responses: {
      '200': {
        description: 'Workflow model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Workflow, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Workflow) filter?: Filter<Workflow>): Promise<Workflow[]> {
    return this.workflowRepository.find(filter);
  }

  @get('/compute/workflows/{id}', {
    responses: {
      '200': {
        description: 'Workflow model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workflow, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Workflow, { exclude: 'where' }) filter?: FilterExcludingWhere<Workflow>,
  ): Promise<Workflow> {
    return this.workflowRepository.findById(id, filter);
  }
  @patch('/compute/workflows/{id}', {
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
          schema: getModelSchemaRef(Workflow, { partial: true }),
        },
      },
    })
    workflow: Workflow,
  ): Promise<void> {
    await this.workflowRepository.updateById(id, workflow);
  }

  @get('/compute/workflows/{id}/status', {
    responses: {
      '200': STATUS_RESPONSE,
    },
  })
  async getWorkflowStatus(@param.path.string('id') id: string): Promise<object> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    const newStatus = (await this.workflowRepository.getWorkflowStatus(id, foundWorkflow, this.req.headers.authorization as string)) as Status;
    foundWorkflow.status = newStatus['status'] !== foundWorkflow.status ? newStatus['status'] : foundWorkflow.status;
    if (newStatus['dateFinished']) {
      foundWorkflow.dateFinished = newStatus['dateFinished'];
    }
    await this.workflowRepository.updateById(id, foundWorkflow);
    return newStatus;
  }
  @get('/compute/workflows/{id}/outputs', {
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowOutput(@param.path.string('id') id: string): Promise<object> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    return this.workflowRepository.getWorkflowOutput(id, foundWorkflow, this.req.headers.authorization as string);
  }
  @get('/compute/workflows/{id}/logs', {
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowLogs(@param.path.string('id') id: string): Promise<object> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    return this.workflowRepository.getWorkflowLogs(id, foundWorkflow, this.req.headers.authorization as string);
  }
  @get('/compute/workflows/{id}/jobs', {
    responses: {
      '200': LOGS_RESPONSE,
    },
  })
  async getWorkflowJobs(@param.path.string('id') id: string): Promise<object> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    return this.workflowRepository.getWorkflowJobs(id, foundWorkflow, this.req.headers.authorization as string);
  }
  @put('/compute/workflows/{id}/stop', {
    responses: {
      '200': {
        description: 'Workflow model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workflow, { includeRelations: true }),
          },
        },
      },
    },
  })
  async stopWorkflow(@param.path.string('id') id: string): Promise<void> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    await this.workflowRepository.stopWorkflow(id, foundWorkflow, this.req.headers.authorization as string);
    foundWorkflow.status = 'CANCELLED';
    return this.workflowRepository.updateById(id, foundWorkflow);
  }
  @put('/compute/workflows/{id}/restart', {
    responses: {
      '200': {
        description: 'Restart workflow',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workflow, { includeRelations: true }),
          },
        },
      },
    },
  })
  async restartWorkflow(@param.path.string('id') id: string): Promise<void> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    await this.workflowRepository.restartWorkflow(id, foundWorkflow, this.req.headers.authorization as string);
    foundWorkflow.status = 'RESTARTED';
    return this.workflowRepository.updateById(id, foundWorkflow);
  }

  @put('/compute/workflows/{id}/pause', {
    responses: {
      '200': {
        description: 'Pause the workflow',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workflow, { includeRelations: true }),
          },
        },
      },
    },
  })
  async pauseWorkflow(@param.path.string('id') id: string): Promise<void> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    await this.workflowRepository.pauseWorkflow(id, foundWorkflow, this.req.headers.authorization as string);
    foundWorkflow.status = 'PAUSED';
    return this.workflowRepository.updateById(id, foundWorkflow);
  }

  @put('/compute/workflows/{id}/saveAsPipeline', {
    responses: {
      '204': {
        description: 'NewWorkflow From Pipeline',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'WorkflowStatus',
              properties: {
                workflowId: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async saveAsPipeline(
    @param.path.string('id') id: string,
    @param.path.string('name') name: string,
    @param.path.string('version') version: string,
  ): Promise<string> {
    const foundWorkflow = await this.workflowRepository.findById(id);
    const pipeline = workflowToPipeline(foundWorkflow, name, version);
    const pipelineToWorkflow = await createPipeline(pipeline, this.pipelineRepository);
    console.log(`Workflow ${id} converted to pipeline with pipeline id ${pipelineToWorkflow.id}`);
    return pipelineToWorkflow.id as string;
  }
  // Map to `GET /ping`
  @get('/compute/health/{driver}', {
    responses: {
      '200': {
        description: 'Driver Health Check',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'ComputeDriverHealthResponse',
              properties: {
                greeting: { type: 'string' },
                date: { type: 'string' },
                url: { type: 'string' },
                headers: {
                  type: 'object',
                  properties: {
                    'Content-Type': { type: 'string' },
                  },
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
  })
  healthDriver(@param.path.string('driver') driver: string): Promise<object> {
    return this.workflowRepository.healthDriverCheck(driver, this.req.headers.authorization as string);
    // Reply with a greeting, the current time, the url, and request headers
  }
}
