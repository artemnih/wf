import { Job } from '../models';
export interface Driver {
  compute(workflowCwl: object, cwlParameters: object, jobs: Job[]): Promise<object>;
  health(driverType: string): Promise<object>;
  getWorkflowStatus(workflowId: string): Promise<object>;
  getWorkflowOutput(workflowId: string): Promise<object>;
  getWorkflowLogs(workflowId: string): Promise<object>;
  getWorkflowJobs(workflowId: string): Promise<object>;
  stopWorkflow(workflowId: string): Promise<object>;
  pauseWorkflow(workflowId: string): Promise<object>;
  restartWorkflow(workflowId: string): Promise<object>;
  resumeWorkflow(workflowId: string): Promise<object>;
}
