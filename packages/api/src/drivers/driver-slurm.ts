import { Driver } from './driver';
import { Job } from '../models';
import { driverCommon, computeCommon, healthCommon } from './common';

export class SlurmDriver implements Driver {
  async compute(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[], token: string) {
    return computeCommon(cwlWorkflow, cwlJobInputs, jobs, 'slurm', token);
  }
  async health(driverType: string, token: string) {
    return healthCommon(driverType, token);
  }
  async getWorkflowStatus(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'status', token);
  }
  async getWorkflowOutput(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'outputs', token);
  }
  async getWorkflowLogs(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'logs', token);
  }
  async getWorkflowJobs(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'jobs', token);
  }
  async stopWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'stop', token, 'PUT');
  }
  async pauseWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'pause', token, 'PUT');
  }
  async restartWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'restart', token, 'PUT');
  }
  async resumeWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'slurm', 'resume', token);
  }
}
