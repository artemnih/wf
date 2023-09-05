import { Driver } from './driver';
import { Job } from '../models';
import { driverCommon, computeCommon, healthCommon } from './common';

export class ArgoDriver implements Driver {
  async compute(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[], token: string) {
    return computeCommon(cwlWorkflow, cwlJobInputs, jobs, 'argo', token);
  }
  async health(driverType: string, token: string) {
    return healthCommon(driverType, token);
  }
  async getWorkflowStatus(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'status', token);
  }
  async getWorkflowOutput(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'outputs', token);
  }
  async getWorkflowLogs(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'logs', token);
  }
  async getWorkflowJobs(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'jobs', token);
  }
  async stopWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'stop', token, 'PUT');
  }
  async pauseWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'pause', token, 'PUT');
  }
  async restartWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'restart', token, 'PUT');
  }
  async resumeWorkflow(workflowId: string, token: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'resume', token, 'PUT');
  }
}
