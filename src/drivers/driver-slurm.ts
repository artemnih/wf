import { Driver } from './driver';
import { Job } from '../models';
import { driverCommon, computeCommon, healthCommon } from './common';

export class SlurmDriver implements Driver {
  compute(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[]) {
    return computeCommon(cwlWorkflow, cwlJobInputs, jobs, 'slurm');
  }
  health(driverType: string) {
    return healthCommon(driverType);
  }

  async getWorkflowStatus(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'status');
  }
  async getWorkflowOutput(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'outputs');
  }
  async getWorkflowLogs(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'logs');
  }
  async getWorkflowJobs(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'jobs');
  }
  async stopWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'stop', 'PUT');
  }
  async pauseWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'pause', 'PUT');
  }
  async restartWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'restart', 'PUT');
  }
  async resumeWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'resume');
  }
}
