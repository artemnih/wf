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

export interface IExplorerController {
	getContent(req: Request, res: Response, next: NextFunction): Promise<Record<string, any>>;
	createDir(req: Request, res: Response, next: NextFunction): Promise<Record<string, any>>;
	uploadFiles(req: Request, res: Response, next: NextFunction): Promise<Record<string, any>>;
	downloadFile(req: Request, res: Response, next: NextFunction): Promise<Record<string, any>>;
	deleteAssets(req: Request, res: Response, next: NextFunction): Promise<Record<string, any>>;
	rename(req: Request, res: Response, next: NextFunction): Promise<Record<string, any>>;
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
	OUTPUTS: '/:id/outputs/*',
	JOBS: '/:id/jobs',
	STOP: '/:id/stop',
};

export const ExplorerRoutes = {
	GET_CONTENT: '/content/*',
	CREATE_DIR: '/newdir/*',
	UPLOAD_FILES: '/upload/*',
	DOWNLOAD_FILE: '/download/*',
	DELETE: '/delete',
	RENAME: '/rename',
};

export interface WorkflowStatusPayloadParam {
	name: string;
	value: string;
	isDir?: boolean;
	metadata: Dictionary<any>;
}
export interface WorkflowStatusPayload {
	status: string;
	startedAt: string;
	finishedAt: string;
	jobs: {
		id: string;
		status: string;
		startedAt: string;
		finishedAt: string;
		params: WorkflowStatusPayloadParam[];
	}[];
}
