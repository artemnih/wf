import { NextFunction, Request, Response } from 'express';

export type Dictionary<T> = { [key: string]: T };

export interface IControllerController {
	createWorkflow(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
	getAllJobsLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowOutputs(req: Request, res: Response, next: NextFunction): Promise<void>;
	getWorkflowJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
	stopWorkflow(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IWorkflowService {
	submit(cwl: any): Promise<string>;
	getStatus(id: string): Promise<{ status: WorkflowStatus }>;
	getLogs(id: string): Promise<string>;
	getOutputs(id: string): Promise<Dictionary<any>>;
	getJobs(id: string): Promise<Dictionary<any>>;
	stop(id: string): Promise<string>;
}

export enum WorkflowStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	SUCCEEDED = 'SUCCEEDED',
	FAILED = 'FAILED',
	SKIPPED = 'SKIPPED',
	ERROR = 'ERROR',
}
