import { NextFunction, Request, Response } from 'express';

export type Dictionary<T> = { [key: string]: T };

export interface IControllerController {
	createWorkflow(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
	getAllJobsLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
	getJobLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowOutputs(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
	stopWorkflow(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export enum WorkflowStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
	SKIPPED = 'SKIPPED',
	ERROR = 'ERROR',
}

export const DriverRoutes = {
	ROOT: '/',
	STATUS: '/:id/status',
	LOGS: '/:id/logs',
	ALL_JOBS_LOGS: '/:id/all-jobs-logs',
	JOB_LOGS: '/:id/job/:jobname/logs',
	OUTPUTS: '/:id/outputs/:job/:output/*',
	JOBS: '/:id/jobs',
	STOP: '/:id/stop',
	FILES_CONTENT: '/files/content/*',
};

export interface WorkflowStatusPayload {
	status: string;
	startedAt: string;
	finishedAt: string;
	jobs: {
		id: string;
		status: string;
		startedAt: string;
		finishedAt: string;
	}[];
}
