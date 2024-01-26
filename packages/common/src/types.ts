import { NextFunction, Request, Response } from 'express';

export type Dictionary<T> = { [key: string]: T };

export interface IDriverController {
    createWorkflow(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWorkflowStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWorkflowLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWorkflowOutputs(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWorkflowJobs(req: Request, res: Response, next: NextFunction): Promise<void>;
    stopWorkflow(req: Request, res: Response, next: NextFunction): Promise<void>;
}