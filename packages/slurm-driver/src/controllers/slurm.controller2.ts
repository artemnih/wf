import { Slurm2 } from '../models';
import SlurmRepository from '../repositories/slurm.repository';
import { NextFunction, Request, Response } from 'express';
import { HpcCli, SlurmCli, toilKillHandler } from '../hpc';
const multer = require("multer");
const path = require("path");
var fs = require('fs');

class SlurmController2 {

	async create(req: Request, res: Response, next: NextFunction) {

		try {
			
			const slurm = req.body as Slurm2;

			// ensure a CWL workflow is provided
			if (!slurm.cwlWorkflow) {
				res.status(400);
				res.send("Key \"cwlWorkflow\" not found in request. A valid CWL workflow must be provided");
			}

			// store CWL to pass to toil
			fs.writeFileSync('cwl.json', JSON.stringify(slurm.cwlWorkflow));

			// ensure job inputs for CWL is provided
			if (!slurm.cwlJobInputs) {
				res.status(400);
				res.send("Key \"cwlJobInputs\" not found in request. An input for the CWL job must be included.");
			}
			
			// write inputs for toil
			fs.writeFileSync('command.json', JSON.stringify(slurm.cwlJobInputs));
			
			// check for custom configuration
			var config: string[]
			if (slurm.config)  {
				config = slurm.config
			}

			var workflowId: string;

			// check if workflow id was supplied
			if (slurm.id) {
				workflowId = slurm.id;
			} else { // set to CWL id if not
				workflowId = JSON.parse(JSON.stringify(slurm.cwlWorkflow)).id;
			}

			const result = SlurmRepository.computeCwlFile('cwl.json', 'command.json', workflowId, config);
			
			// return status that workflow is has started
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
			console.log("id: " + id);
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

export default new SlurmController2();
