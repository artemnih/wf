import { Driver } from './driver';
import { Job } from '../models';
import { driverCommon, computeCommon, healthCommon } from './common';

export class ArgoDriver implements Driver {
  compute(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[]) {
    return computeCommon(cwlWorkflow, cwlJobInputs, jobs, 'argo');
  }

  health(driverType: string) {
    return healthCommon(driverType);
  }

  async getWorkflowStatus(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'status');
  }
  async getWorkflowOutput(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'outputs');
  }
  async getWorkflowLogs(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'logs');
  }
  async getWorkflowJobs(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'jobs');
  }
  async stopWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'stop', 'PUT');
  }
  async pauseWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'pause', 'PUT');
  }
  async restartWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'restart', 'PUT');
  }
  async resumeWorkflow(workflowId: string): Promise<object> {
    return driverCommon(workflowId, 'argo', 'resume', 'PUT');
  }
}
