import { Dictionary, WorkflowStatus } from '@polusai/compute-common';
import { buildId, getGuid, getPid } from '../utils';
import * as fs from 'fs';
import * as stream from 'stream';
import { statusFromLogs } from '../helpers/status-from-logs';
import { getSingleJobLogs } from '../helpers/get-single-job-logs';
require('dotenv').config();

const spawn = require('child_process').spawn;
const config = require('config');
const tempAssetsDir = config.volume.basePath + '/temp';
const logsDir = config.volume.basePath + '/logs';

interface ComputePayload {
	cwlWorkflow: any;
	cwlJobInputs: {
		[key: string]: any;
	};
	jobs: any;
}

class WorkflowService {
	async submit(cwl: ComputePayload) {
		// there is no need for the baseCommand in the cwlWorkflow if we are using dockerPull
		Object.values(cwl.cwlWorkflow.steps).forEach((step: any) => {
			if (step.run?.requirements?.DockerRequirement.dockerPull) {
				delete step.run.baseCommand;
			}
		});

		// get the base path from the config
		const basePath = config.volume.basePath;

		// generate a random id for the workflow
		const tempId = Math.random().toString(36).substring(2, 15);

		// create a directory for temp files based on tempId
		const workflowPath = `${basePath}/${tempId}`;
		fs.mkdirSync(workflowPath, { recursive: true });
		console.log('Creating workflow directory', workflowPath);

		// create dir for temp files such as cwl json
		fs.mkdirSync(tempAssetsDir, { recursive: true });

		// create dir for logs
		fs.mkdirSync(logsDir, { recursive: true });

		Object.values(cwl.cwlJobInputs).forEach(input => {
			if (input.class === 'Directory' && input.location) {
				// change value of location to workflow directory or basePath if location is not a temp directory
				const isTempDir = !input.location.startsWith('/');
				const outputDir = isTempDir ? `${workflowPath}/${input.location}` : `${basePath}${input.location}`;
				if (isTempDir) {
					fs.mkdirSync(outputDir, { recursive: true });
				}
				console.log('Change input location to', outputDir);
				input.location = outputDir;
			}
		});

		// save the cwl workflow and job inputs to files
		console.log('Saving workflow to file to', `${tempAssetsDir}/${tempId}.json`);
		fs.writeFileSync(`${tempAssetsDir}/${tempId}.json`, JSON.stringify(cwl.cwlWorkflow, null, 2), 'utf-8');

		// save the cwl job inputs to files
		console.log('Saving job inputs to file to', `${tempAssetsDir}/${tempId}-inputs.json`);
		fs.writeFileSync(`${tempAssetsDir}/${tempId}-inputs.json`, JSON.stringify(cwl.cwlJobInputs, null, 2), 'utf-8');

		// change directory to workflow directory so that all temp files are created in the workflow directory
		process.chdir(workflowPath);
		console.log(`Change dir to: ${process.cwd()}`);

		console.log('Starting cwltool');
		const myProcess = spawn('cwltool', [`--verbose`, `${tempAssetsDir}/${tempId}.json`, `${tempAssetsDir}/${tempId}-inputs.json`], {
			detached: true,
		});

		const pid = myProcess.pid;
		if (!pid) {
			// process failed to start
			// todo: log error
			return null;
		}

		console.log(`Process started with pid ${tempId}`);

		fs.writeFileSync(`${logsDir}/stdout-${tempId}.log`, '', 'utf-8');

		myProcess.stderr.on('data', (data: any) => {
			const date = new Date().toISOString();
			data = `[time: ${date}]: ${data}`;
			fs.appendFileSync(`${logsDir}/stdout-${tempId}.log`, data, 'utf-8');
			console.log(`${data}`);
		});

		myProcess.on('error', (error: any) => {
			console.error('Failed to start child process.', error);
		});

		return buildId(pid.toString(), tempId);
	}

	async getStatus(id: string) {
		const guid = getGuid(id);

		console.log('Checking logs for status', guid);
		try {
			const log = await fs.readFileSync(`${logsDir}/stdout-${guid}.log`, 'utf-8');
			console.log('Log file exists', log.length);
			const statusPayload = statusFromLogs(log);
			console.log('Status payload', statusPayload);

			// include paths from cwl json per each step/job

			return statusPayload;
		} catch (error) {
			console.log('Error while reading log file', error);
			return {
				status: WorkflowStatus.ERROR,
				startedAt: '',
				finishedAt: '',
				jobs: [],
			};
		}
	}

	async getLogs(id: string) {
		const guid = getGuid(id);
		try {
			const log = await fs.readFileSync(`${logsDir}/stdout-${guid}.log`, 'utf-8');
			return log;
		} catch (error) {
			return 'No logs available';
		}
	}

	async getJobLogs(id: string, jobName: string) {
		const guid = getGuid(id);
		try {
			const log = fs.readFileSync(`${logsDir}/stdout-${guid}.log`, 'utf-8');
			return getSingleJobLogs(log, jobName);
		} catch (error) {
			return 'No logs available';
		}
	}

	async getAllJobsLogs(id: string) {
		const guid = getGuid(id);
		try {
			const log = fs.readFileSync(`${logsDir}/stdout-${guid}.log`, 'utf-8');
			return log;
		} catch (error) {
			return 'No logs available';
		}
	}

	async getOutputs(id: string, job: string, output: string, path: string) {
		const guid = getGuid(id);
		console.log('Getting outputs for', guid, job, output, path);

		// read workflow file to get the output directory and jobs
		const inputsJson = fs.readFileSync(`${tempAssetsDir}/${guid}-inputs.json`, 'utf-8');
		if (!inputsJson) {
			throw new Error('Inputs json not found');
		}

		const inputs = JSON.parse(inputsJson);
		const key = `${job}_${output}`;
		const outputObj = inputs[key];
		if (!outputObj) {
			throw new Error('Output not found');
		}

		const outputDir = outputObj.location;
		if (!outputDir) {
			throw new Error('Output directory property value not found');
		}

		const fullPath = `${outputDir}/${path}`;
		console.log('Full path:', fullPath);

		if (fs.lstatSync(fullPath).isFile()) {
			const fileStream = fs.createReadStream(fullPath);
			return { stream: fileStream };
		}

		const content = fs.readdirSync(fullPath, { withFileTypes: true });
		const filesAndDirs = content.map(item => ({
			name: item.name,
			type: item.isFile() ? 'file' : 'directory',
		}));

		// return json as a stream
		const ts = new stream.Transform();
		ts.push(JSON.stringify(filesAndDirs));
		ts.push(null);
		return { stream: ts };
	}

	async getJobs(id: string): Promise<Dictionary<any>> {
		const guid = getGuid(id);
		throw new Error('Method not implemented.');
	}

	async stop(id: string) {
		const pid = getPid(id);
		try {
			const result = process.kill(parseInt(pid), 'SIGTERM');
			return 'Process stopped';
		} catch (error) {
			return 'Process not running';
		}
	}
}

export default new WorkflowService();
