import { NextFunction } from 'express';
import { Request, Response } from 'express';
import WorkflowService from '../services/workflow.service';
import { IControllerController } from '@polusai/compute-common';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

class WorkflowController implements IControllerController {
	async createWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const cwl = req.body as any;
			const id = await WorkflowService.submit(cwl);
			if (!id) {
				console.log('Error occurred while submitting', id);
				res.status(400).send('Error occurred while submitting');
				return;
			}
			res.status(201).send(id.toString());
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const status = await WorkflowService.getStatus(id);
			res.status(200).json(status);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const logs = await WorkflowService.getLogs(id);
			res.status(200).send(logs);
		} catch (error) {
			next(error);
		}
	}

	async stop(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const status = await WorkflowService.stop(id);
			res.status(200).json(status);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowOutputs(req: Request, res: Response, next: NextFunction) {
		throw new Error('Method not implemented.');
	}

	async getWorkflowJobs(req: Request, res: Response, next: NextFunction) {
		throw new Error('Method not implemented.');
	}

	async stopWorkflow(req: Request, res: Response, next: NextFunction) {
		throw new Error('Method not implemented.');
	}
}

export default new WorkflowController();
