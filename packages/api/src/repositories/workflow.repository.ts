import { inject } from '@loopback/core';
import { DefaultCrudRepository, repository } from '@loopback/repository';
import { WorkflowDbDataSource } from '../datasources';
import { Workflow, WorkflowRelations } from '../models';
import { Driver } from '../drivers';
import { ComputeApiBindings } from '../keys';
import { workflowToCwl, cwlJobInputs } from '../services/CWLConvertors';

import { DriverFactory } from '../drivers';
import { pipelineToWorkflow, workflowToJobs } from '../services';
import { PluginRepository } from './plugin.repository';
import { PipelineRepository } from './pipeline.repository';

export class WorkflowRepository extends DefaultCrudRepository<Workflow, typeof Workflow.prototype.id, WorkflowRelations> {
  constructor(
    @inject('datasources.WorkflowDb') dataSource: WorkflowDbDataSource,
    @inject(ComputeApiBindings.DRIVER_FACTORY) public driver: Driver,
    @repository(PluginRepository) public pluginRepository: PluginRepository,
    @repository(PipelineRepository) public pipelineRepository: PipelineRepository,
  ) {
    super(Workflow, dataSource);
  }
  changeDriver(workflow: Workflow): void {
    if (workflow.driver) {
      console.log(`Changing your driver to ${workflow.driver}`);
      this.driver = DriverFactory.createDriver(workflow.driver);
    }
  }
  async submitWorkflowToDriver(
    workflowWithPotentialPipelines: Workflow,
    pluginRepository: PluginRepository,
    pipelineRepository: PipelineRepository,
    token: string,
  ): Promise<object> {
    this.changeDriver(workflowWithPotentialPipelines);
    const workflow = await pipelineToWorkflow(workflowWithPotentialPipelines, pipelineRepository);
    console.info('Workflow submitted: ', workflow);
    const jobs = await workflowToJobs(workflow, workflow.cwlJobInputs, pluginRepository);
    return this.driver.compute(workflowToCwl(workflow), cwlJobInputs(workflow), jobs, token);
  }
  async getWorkflowStatus(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.getWorkflowStatus(id, token);
  }
  async getWorkflowOutput(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.getWorkflowOutput(id, token);
  }
  async getWorkflowLogs(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.getWorkflowLogs(id, token);
  }
  async getWorkflowJobs(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.getWorkflowJobs(id, token);
  }
  async stopWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.stopWorkflow(id, token);
  }
  async pauseWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.pauseWorkflow(id, token);
  }
  async restartWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.restartWorkflow(id, token);
  }
  async resumeWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
    this.changeDriver(workflow);
    return this.driver.resumeWorkflow(id, token);
  }
  async resubmitWorkflow(workflow: Workflow, token: string): Promise<object> {
    return this.submitWorkflowToDriver(workflow, this.pluginRepository, this.pipelineRepository, token);
  }
  async healthDriverCheck(driverType: string, token: string): Promise<object> {
    return this.driver.health(driverType, token);
  }
}
