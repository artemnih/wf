import { JobCrud, Workflow } from '../models';
import WorkflowRepository from '../repositories/workflow.repository';
import { WorkflowCrud } from '../models';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils';

export class WorkflowController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const workflow = req.body as Workflow;
			const token = req.headers.authorization as string;
			workflow.dateCreated = new Date().toISOString();
			const workflowCreated = await WorkflowCrud.create(workflow);

			logger.info(`Workflow has been created, id: ${workflowCreated.id}`);

			const driverWorkflowId = await WorkflowRepository.submitWorkflowToDriver(workflowCreated, token);
			logger.info(`Driver workflow id: ${driverWorkflowId}`);

			workflowCreated.driverWorkflowId = driverWorkflowId as string;
			await workflowCreated.save();

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
			const workflow = await WorkflowCrud.findById(id);
			const newStatus = await WorkflowRepository.getWorkflowStatus(workflow, req.headers.authorization);
			workflow.status = newStatus.status !== workflow.status ? newStatus.status : workflow.status;

			if (newStatus.dateFinished) {
				workflow.dateFinished = newStatus.dateFinished;
			}

			await workflow.save();
			res.status(200).json(newStatus);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowLogs(req: Request, res: Response, next: NextFunction) {
		logger.info('Compute: Getting workflow logs');
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const logs = await WorkflowRepository.getWorkflowLogs(foundWorkflow, req.headers.authorization as string);
			res.status(200).json(logs);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowOutput(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			if (!id) {
				const errorMessage = 'Missing parameter: id';
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}

			const splitStr = `${id}/output/`;
			const index = req.url.indexOf(splitStr);

			if (index === -1) {
				const errorMessage = 'Url is not correct';
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}

			const path = req.url.substring(index + splitStr.length);
			const foundWorkflow = await WorkflowCrud.findById(id);

			if (!foundWorkflow) {
				const errorMessage = `Workflow with id ${id} not found`;
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}

			const responseAxios = await WorkflowRepository.getWorkflowOutput(foundWorkflow, path, req.headers.authorization as string);
			const stream = responseAxios.data;

			stream.on('data', (chunk: any) => {
				res.write(chunk);
			});

			stream.on('end', () => {
				res.end();
			});

			stream.on('error', (error: any) => {
				logger.error(`Error while streaming: ${error.message}`);
				res.status(500).send('Error while getting workflow output');
			});
		} catch (error) {
			res.status(500).send('Error while getting workflow output');
			next(error);
		}
	}

	async getWorkflowJobs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const jobs = await WorkflowRepository.getWorkflowJobs(foundWorkflow, req.headers.authorization as string);
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

	async getAllJobsLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const logs = await WorkflowRepository.getAllJobsLogs(foundWorkflow, req.headers.authorization as string);
			res.status(200).json(logs);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowJobLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const jobId = req.params.jobId;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const logs = await WorkflowRepository.getWorkflowJobLogs(foundWorkflow, jobId, req.headers.authorization as string);
			res.status(200).json(logs);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowJobStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const jobId = req.params.jobId;
			const foundWorkflow = await WorkflowCrud.findById(id);
			const status = await WorkflowRepository.getWorkflowJobStatus(foundWorkflow, jobId, req.headers.authorization as string);
			logger.info(`Status of job ${jobId} is ${status}`);
			res.status(200).json(status);
		} catch (error) {
			next(error);
		}
	}

	async stopWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			await WorkflowRepository.stopWorkflow(foundWorkflow, req.headers.authorization as string);
			foundWorkflow.status = 'CANCELLED';
			await foundWorkflow.save();
			res.status(200).json(foundWorkflow);
		} catch (error) {
			next(error);
		}
	}

	async restartWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			await WorkflowRepository.restartWorkflow(foundWorkflow, req.headers.authorization as string);
			foundWorkflow.status = 'RESTARTED';
			await foundWorkflow.save();
			res.status(200).json(foundWorkflow);
		} catch (error) {
			next(error);
		}
	}

	async pauseWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const foundWorkflow = await WorkflowCrud.findById(id);
			await WorkflowRepository.pauseWorkflow(foundWorkflow, req.headers.authorization as string);
			foundWorkflow.status = 'PAUSED';
			await foundWorkflow.save();
			res.status(200).json(foundWorkflow);
		} catch (error) {
			next(error);
		}
	}

	async checkHealth(req: Request, res: Response, next: NextFunction) {
		try {
			const driver = req.params.driver;
			logger.info(`Checking Driver health: ${driver}`);
			const health = await WorkflowRepository.healthDriverCheck(driver, req.headers.authorization as string);
			res.status(200).json(health);
		} catch (error) {
			if (error) {
				logger.error(`Error while checking health: ${error.message}`);
				res.status(500).send('Something went wrong: ' + error.message);
			} else {
				next(error);
			}
		}
	}

	async getDriverLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const driver = req.params.driver;
			logger.info(`Fetching logs for driver: ${driver}`);
			const logs = await WorkflowRepository.getDriverLogs(driver, req.headers.authorization as string);
			res.status(200).json(logs);
		} catch (error) {
			next(error);
		}
	}
}

export default new WorkflowController();
