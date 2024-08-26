import { Slurm } from '../models';
import SlurmRepository from '../repositories/slurm.repository';
import { NextFunction, Request, Response } from 'express';
import { HpcCli, SlurmCli, toilKillHandler } from '../hpc';
import { IControllerController } from '@polusai/compute-common';
import {toilOutputDir, toilLogsDir} from '../server';
import path from 'path';

var fs = require('fs');
const slurmConfig = require('config');

class SlurmController implements IControllerController {
	async createWorkflow(req: Request, res: Response, next: NextFunction) {
		try {
			// parse request
			const slurm = req.body as Slurm;

			// ensure a CWL workflow is provided
			if (!slurm.cwlWorkflow) {
				res.status(400);
				res.send('Key "cwlWorkflow" not found in request. A valid CWL workflow must be provided');
			}

			// store CWL to pass to toil
			fs.writeFileSync('cwl.json', JSON.stringify(slurm.cwlWorkflow));

			// ensure job inputs for CWL is provided
			if (!slurm.cwlJobInputs) {
				res.status(400);
				res.send('Key "cwlJobInputs" not found in request. An input for the CWL job must be included.');
			}

			// write inputs for toil
			fs.writeFileSync('command.json', JSON.stringify(slurm.cwlJobInputs));

			// check for custom configuration
			const config: string[] = slurm.config ?? [];

			// check if workflow id was supplied
			const workflowId: string = slurm.id ? slurm.id : JSON.parse(JSON.stringify(slurm.cwlWorkflow)).id;

			// create subdirectories in asset folders for specific workflow
			const workflowOutputPath = path.join(toilOutputDir, workflowId.toString());
			const logsOutputPath = path.join(toilLogsDir, workflowId.toString());

			fs.mkdirSync(workflowOutputPath, { recursive: true });
			fs.mkdirSync(logsOutputPath, { recursive: true });

			const result = SlurmRepository.computeCwlFile('cwl.json', 'command.json', workflowId, workflowOutputPath, logsOutputPath, config);

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
		// get workflow id
		const id = req.params.id;

		try { 
			// read contents from correct directory for the workflow id
			const outputPath = `${toilLogsDir}/${id}`;

			const fileList = fs.readdirSync(outputPath);

			var result: JSON;
			var temp: any = {};

			// read all files in the output directory and send as JSON
			fileList.forEach((file: any) => {
				try {
					// read contents of file and add to JSON object with key as the filename
					temp[file] = fs.readFileSync(`${outputPath}/${file}`, 'utf-8');
				} catch (err) {
					console.error(`Error reading ${file}:`, err);

					res.status(500);
					res.send(`Error reading ${file} for workflow id ${id}.`);
				}
			});
		} catch (err) {
			console.error(err);

			res.status(404);
			res.send(`Invalid workflow id ${id}. Make sure that id=${id} is a valid workflow`);
		}

		try {
			// cast results to JSON
			result = <JSON>temp;
		} catch (err) {
			console.error(err);

			res.status(404);
		}

		// send contents of file
		res.status(200).json(result);
	}

	async getWorkflowOutputs(req: Request, res: Response, next: NextFunction) {
		try {
			// get workflow id
			const id = req.params.id;

			try { 
				// read contents from correct directory for the workflow id
				const outputPath = `${toilOutputDir}/${id}`;
				const fileList = fs.readdirSync(outputPath);

				var result: JSON;
				var temp: any = {};

				// read all files in the output directory and send as JSON
				fileList.forEach((file: any) => {
					try {
						// read contents of file and add to JSON object with key as the filename
						temp[file] = fs.readFileSync(`${outputPath}/${file}`, 'utf-8');
					} catch (err) {
						console.error(`Error reading ${file}:`, err);

						res.status(500);
						res.send(`Error reading ${file} for workflow id ${id}.`);
					}
				});
			} catch (err) {
				console.error(err);

				res.status(404);
				res.send(`Invalid workflow id ${id}. Make sure that id=${id} is a valid workflow`);
			}

			// cast results to JSON
			result = <JSON>temp;

			// send contents of file
			res.status(200).json(result);
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

	async stopWorkflow(req: Request, res: Response, next: NextFunction) {
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

	async getAllJobsLogs(req: Request, res: Response, next: NextFunction) {
		res.status(501).send('Job logs are not implemented for the Slurm driver');
	}

	async getJobLogs(req: Request, res: Response, next: NextFunction) {
		res.status(501).send('Job logs are not implemented for the Slurm driver');
	}

	async getContent(req: Request, res: Response, next: NextFunction) {
		res.status(501).send('Job logs are not implemented for the Slurm driver');
	}
}

export default new SlurmController();
