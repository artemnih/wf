import { Slurm2 } from '../models';
import SlurmRepository from '../repositories/slurm.repository';
import { NextFunction, Request, Response } from 'express'; 
import { HpcCli, SlurmCli, toilKillHandler } from '../hpc';
const multer = require("multer");
const path = require("path");
var fs = require('fs');
const slurmConfig = require('config');

class SlurmController2 {

	async create(req: Request, res: Response, next: NextFunction) {

		try {
			
			// parse request
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
			const config: string[] = slurm.config ?? [];

			// check if workflow id was supplied
			const workflowId: string = slurm.id ? slurm.id : JSON.parse(JSON.stringify(slurm.cwlWorkflow)).id;;

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
		// get workflow id
		const id = req.params.id;

		// working directory for toil
		var currentDir = slurmConfig.slurmCompute.data

		try {
			
			// read contents from correct directory for the workflow id
			const outputPath = `${currentDir}/${id}/logs`
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
	}

	async getWorkflowOutputs(req: Request, res: Response, next: NextFunction) {
		try {

			// get workflow id
			const id = req.params.id;

			// working directory for toil
			var currentDir = slurmConfig.slurmCompute.data

			try {
				
				// read contents from correct directory for the workflow id
				const outputPath = `${currentDir}/${id}/out`
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
