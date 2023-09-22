import { Driver } from './driver';
import { Job } from '../models';
import { driverCommon, computeCommon, healthCommon } from './common';

export class SingleNodeDriver implements Driver {
  async compute(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[], token: string) {
    return computeCommon(cwlWorkflow, cwlJobInputs, jobs, 'singlenode', token);
  }
  async health(driverType: string, token: string) {
    return healthCommon(driverType, token);
  }
  async getWorkflowStatus(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'status', token);
  }
  async getWorkflowOutput(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'outputs', token);
  }
  async getWorkflowLogs(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'logs', token);
  }
  async getWorkflowJobs(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'jobs', token);
  }
  async stopWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'stop', token, 'PUT');
  }
  async pauseWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'pause', token, 'PUT');
  }
  async restartWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'restart', token, 'PUT');
  }
  async resumeWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'singlenode', 'resume', token);
  }
}
