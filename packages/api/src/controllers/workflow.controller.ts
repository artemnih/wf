import { JobCrud, Workflow } from '../models';
import WorkflowRepository from '../repositories/workflow.repository';
import { WorkflowCrud } from '../models';
import { NextFunction, Request, Response } from 'express';

interface Status {
	status: string;
	dateFinished: string;
}

export class WorkflowController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const workflow = req.body as Workflow;
			const token = req.headers.authorization as string;
			workflow.dateCreated = new Date().toISOString();
			const workflowCreated = await WorkflowCrud.create(workflow);
			await WorkflowRepository.submitWorkflowToDriver(workflowCreated, token);
			res.status(201).json(workflowCreated);
		} catch (error) {
			next(error);
		}
	}

	async resubmitWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.body as string;
			const token = req.headers.authorization as string;
			const foundWorkflow = await WorkflowCrud.findById(id);
			foundWorkflow.id = undefined;
			const newWorkflow = await WorkflowCrud.create(foundWorkflow);
			await WorkflowRepository.resubmitWorkflow(newWorkflow, token);
			res.status(201).json(newWorkflow);
		} catch (error) {
			next(error);
		}
	}

	async find(req: Request, res: Response, next: NextFunction) {
		try {
			const filter = req.query as any;
			const workflows = await WorkflowCrud.find(filter);
			res.status(200).json(workflows);
		} catch (error) {
			next(error);
		}
	}

	async findById(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const workflow = await WorkflowCrud.findById(id);
			res.status(200).json(workflow);
		} catch (error) {
			next(error);
		}
	}

	async updateById(req: Request, res: Response, next: NextFunction) {
		try {
			const workflow = req.body as Workflow;
			const newWorkflow = await WorkflowCrud.findOneAndUpdate({ _id: workflow.id }, workflow, { new: true });
			res.status(200).json(newWorkflow);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const newStatus = (await WorkflowRepository.getWorkflowStatus(
				id,
				foundWorkflow,
				req.headers.authorization as string,
			)) as Status;
			foundWorkflow.status = newStatus.status !== foundWorkflow.status ? newStatus.status : foundWorkflow.status;

			if (newStatus.dateFinished) {
				foundWorkflow.dateFinished = newStatus.dateFinished;
			}

			await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
			res.status(200).json(newStatus);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const logs = await WorkflowRepository.getWorkflowLogs(id, foundWorkflow, req.headers.authorization as string);
			res.status(200).json(logs);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowOutput(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const outputs = await WorkflowRepository.getWorkflowOutput(id, foundWorkflow, req.headers.authorization as string);
			res.status(200).json(outputs);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowJobs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const jobs = await WorkflowRepository.getWorkflowJobs(id, foundWorkflow, req.headers.authorization as string);
			for (const job of Object.values(jobs)) {
				const foundJob = await JobCrud.findById(job.id);
				if (!foundJob) {
					job._id = job.id;
					await JobCrud.create(job);
				}
			}
			res.status(200).json(jobs);
		} catch (error) {
			next(error);
		}
	}

	async stopWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			await WorkflowRepository.stopWorkflow(id, foundWorkflow, req.headers.authorization as string);
			foundWorkflow.status = 'CANCELLED';
			const updated = await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
			res.status(200).json(updated);
		} catch (error) {
			next(error);
		}
	}

	async restartWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			await WorkflowRepository.restartWorkflow(id, foundWorkflow, req.headers.authorization as string);
			foundWorkflow.status = 'RESTARTED';
			const updated = await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
			res.status(200).json(updated);
		} catch (error) {
			next(error);
		}
	}

	async pauseWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			await WorkflowRepository.pauseWorkflow(id, foundWorkflow, req.headers.authorization as string);
			foundWorkflow.status = 'PAUSED';
			const updated = await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
			res.status(200).json(updated);
		} catch (error) {
			next(error);
		}
	}

	async healthDriver(req: Request, res: Response, next: NextFunction) {
		try {
			const driver = req.params.driver;
			const health = await WorkflowRepository.healthDriverCheck(driver, req.headers.authorization as string);
			res.status(200).json(health);
		} catch (error) {
			next(error);
		}
	}
}

export default new WorkflowController();
