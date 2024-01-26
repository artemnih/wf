import { Slurm } from '../models';
import SlurmRepository from '../repositories/slurm.repository';
import { NextFunction, Request, Response } from 'express';
import { HpcCli, SlurmCli, toilKillHandler } from '../hpc';

class SlurmController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const slurm = req.body as Slurm;
			const result = SlurmRepository.compute(slurm.cwlWorkflow, slurm.cwlJobInputs, slurm.jobs);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			require('dotenv').config();
			const slurmConfig = require('config');

			const result = SlurmRepository.getWorkflowStatus(`${slurmConfig.slurmCompute.data}/${id}.status.json`);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const result = SlurmRepository.getWorkflowLogs(id);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowOutputs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const result = SlurmRepository.getWorkflowOutputs(id);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	async getWorkflowJobs(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const hpcCli: HpcCli = new SlurmCli();
			const result = SlurmRepository.getWorkflowJobs(id, hpcCli);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}

	stopWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.params.id;
			const hpcCli: HpcCli = new SlurmCli();
			const toilHandler = toilKillHandler;
			const result = SlurmRepository.stopWorkflow(id, hpcCli, toilHandler);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	}
}

export default new SlurmController();
