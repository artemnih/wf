import { WorkflowExecutionRequest } from '../types';
import { getTargetFromJobs } from '../services';
import { Target } from '../services/getTargetFromJobs';
import { NextFunction, Request, Response } from 'express';
import { IControllerController } from '@polusai/compute-common';
import {
	createWorkflow,
	statusOfArgoWorkflow,
	getWorkflowLog,
	getAllJobsLogs,
	getJobLogs,
	getArgoJobStatus,
	stopArgoWorkflow,
} from '../services/argoApi';

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

	async getWorkflowOutputs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const jobs = await getArgoJobStatus(id);
			const result = getTargetFromJobs(jobs, Target.outputs);
			res.status(201).json(result);
		} catch (error) {
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
