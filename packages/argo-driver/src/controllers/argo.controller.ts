import { WorkflowExecutionRequest } from '../types';
import { NextFunction, Request, Response } from 'express';
import { DriverRoutes, IControllerController } from '@polusai/compute-common';
import {
	createWorkflow,
	statusOfArgoWorkflow,
	getWorkflowLog,
	getAllJobsLogs,
	getJobLogs,
	getArgoJobStatus,
	stopArgoWorkflow,
	getJobStatus,
} from '../services/argoApi';
import fs from 'fs';
import { getContent } from '../services/argoApi/get-content';
import { logger } from '../services/logger';

class ArgoController implements IControllerController {
	/**
	 * Create an argo workflow and submit it for execution.
	 * @param req the request coming from compute api.
	 * @param res the submission result
	 */
	async createWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			// parsing request body as is
			const request = req.body as WorkflowExecutionRequest;
			const argoResponse = await createWorkflow(request.cwlWorkflow, request.cwlJobInputs, request.jobs);
			res.status(201).json(argoResponse);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const result = await statusOfArgoWorkflow(id);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowLogs(req: Request, res: Response, next: NextFunction) {
		try {
			logger.info('Argo Driver: getting logs');
			const id = req.params.id;
			const content = await getWorkflowLog(id);
			res.status(201).send(content);
		} catch (error) {
			next(error);
		}
	}

	async getAllJobsLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const result = await getAllJobsLogs(id);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getJobLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const jobName = req.params.jobname;
			const result = await getJobLogs(id, jobName);
			res.status(201).send(result);
		} catch (error) {
			next(error);
		}
	}

	async getJobStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const jobName = req.params.jobname;
			const result = await getJobStatus(id, jobName);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowOutputs(req: Request, res: Response, next: NextFunction) {
		try {
			logger.info('Getting outputs:' + req.url);
			const url = req.url;
			const workflowId = req.params.id;
			if (!workflowId) { 
				const errorMessage = 'Workflow id is required';
				logger.error(errorMessage);
				throw new Error(errorMessage);
            }
			const search = `/${workflowId}/outputs/`;
			const index = url.indexOf(search);
			if (index === -1) { 
				const errorMessage = 'Invalid path';
				logger.error(errorMessage);
				throw new Error(errorMessage);
            }
			const path = url.substring(index + search.length);
			const decodedPath = decodeURIComponent(path);
			if (decodedPath.includes('..')) { 
				const errorMessage = 'Invalid path';
				logger.error(errorMessage);
				throw new Error(errorMessage);
            }
			const fullPath = `${workflowId}/${decodedPath}`;
			const respo = await getContent(fullPath);
			respo.stream.pipe(res);
		} catch (error) {
			next(error);
		}
	}

	async getContent(req: Request, res: Response, next: NextFunction) {
		try {
			logger.info('Getting content:' + req.url);
			const url = req.url;
			const search = DriverRoutes.FILES_CONTENT.split('*')[0];
			const index = url.indexOf(search);
			if (index === -1) { 
				const errorMessage = 'Invalid path';
				logger.error(errorMessage);
				throw new Error(errorMessage);
            }
			const path = url.substring(index + search.length);
			const decodedPath = decodeURIComponent(path);
			if (decodedPath.includes('..')) { 
				const errorMessage = 'Invalid path';
				logger.error(errorMessage);
				throw new Error(errorMessage);
            }
			const respo = await getContent(decodedPath);
			respo.stream.pipe(res);
		} catch (error) {
			logger.error('Error while getting content: ' + JSON.stringify(error));			
			res.status(500).send('Error while getting content: ' + error.message);
			next(error);
		}
	}

	async getWorkflowJobs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const result = await getArgoJobStatus(id);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async stopWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const result = await stopArgoWorkflow(id);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}
}

export default new ArgoController();
