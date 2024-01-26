import { Job } from '../models';

export interface Driver {
	compute(workflowCwl: object, cwlParameters: object, jobs: Job[], token: string): Promise<object>;
	health(driverType: string, token: string): Promise<object>;
	getWorkflowStatus(workflowId: string, token: string): Promise<object>;
	getWorkflowOutput(workflowId: string, token: string): Promise<object>;
	getWorkflowLogs(workflowId: string, token: string): Promise<object>;
	getWorkflowJobs(workflowId: string, token: string): Promise<object>;
	stopWorkflow(workflowId: string, token: string): Promise<object>;
	pauseWorkflow(workflowId: string, token: string): Promise<object>;
	restartWorkflow(workflowId: string, token: string): Promise<object>;
	resumeWorkflow(workflowId: string, token: string): Promise<object>;
}
