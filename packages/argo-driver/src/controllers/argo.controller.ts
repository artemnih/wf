import ArgoRepository from '../repositories/argo.repository';
import { ArgoLogRecord, WorkflowExecutionRequest } from '../types';
import { statusOfArgoWorkflow, getArgoJobStatus, stopArgoWorkflow } from '../services/argoApi';
import { getTargetFromJobs } from '../services';
import { Target } from '../services/getTargetFromJobs';
import { NextFunction, Request, Response } from 'express';
import { getWorkflowLog } from '../services/argoApi/get-workflow-log';
import { IDriverController } from '@polusai/compute-common';

class ArgoController implements IDriverController {
	/**
	 * Create an argo workflow and submit it for execution.
	 * @param req the request coming from compute api.
	 * @param res the submission result
	 */
	async createWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			// parsing request body as is
			const request = req.body as WorkflowExecutionRequest;
			const argoResponse = ArgoRepository.createWorkflow(request.cwlWorkflow, request.cwlJobInputs, request.jobs);
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
			const payload = await getWorkflowLog(id);
			let rawLogs = payload.data;
			const lines = (rawLogs.split('\n') as string[]).filter(s => !!s.trim());
			const jsonLines = lines.map(line => JSON.parse(line) as ArgoLogRecord);
			const content = jsonLines.map(line => line.result.content).join('\n');
			res.status(201).send(content);
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
