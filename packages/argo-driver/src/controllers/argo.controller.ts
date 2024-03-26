import { WorkflowExecutionRequest } from '../types';
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
	getJobStatus,
} from '../services/argoApi';
import fs from 'fs';
require('dotenv').config();
const argoConfig = require('config');

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
			const id = req.params.id;

			if (!id) {
				throw new Error('Workflow id is required');
			}

			const splitStr = `/${id}/outputs/`;
			const index = req.url.indexOf(splitStr);

			if (index === -1) {
				throw new Error('Invalid output url');
			}

			const url = req.url.substring(index + splitStr.length);
			console.log('ARGO: Getting workflow output:', id, 'url:', url);

			const decodedPath = decodeURIComponent(url);

			if (decodedPath.includes('..')) {
				throw new Error('Invalid path');
			}

			const parentPath = argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath;
			const fullPath = parentPath + '/' + decodedPath;
			console.log('ARGO: full path:', fullPath);

			// check if path is a file
			if (fs.lstatSync(fullPath).isFile()) {
				const fileStream = fs.createReadStream(fullPath);
				fileStream.pipe(res);
				return;
			}

			const content = fs.readdirSync(fullPath, { withFileTypes: true });
			const files = content
				.filter(item => item.isFile())
				.map(item => ({
					name: item.name,
					type: 'file',
				}));
			const dirs = content
				.filter(item => item.isDirectory())
				.map(item => ({
					name: item.name,
					type: 'directory',
				}));

			// concat files and dirs
			const filesAndDirs = files.concat(dirs);

			res.writeHead(200, {
				'Content-Type': 'application/json',
			});

			res.write(JSON.stringify(filesAndDirs));
			res.end();
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
