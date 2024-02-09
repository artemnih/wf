import { Dictionary, IWorkflowService, WorkflowStatus } from '@polusai/compute-common';
import { buildId, getGuid, getPid } from '../utils';
import fs from 'fs';
import { statusFromLogs } from '../helpers/status-from-logs';
import { getSingleJobLogs } from '../helpers/get-single-job-logs';
const spawn = require('child_process').spawn;

interface ComputePayload {
	cwlWorkflow: any;
	cwlJobInputs: any;
	jobs: any;
}

class WorkflowService implements IWorkflowService {
	async submit(cwl: ComputePayload) {
		// there is no need for the baseCommand in the cwlWorkflow if we are using dockerPull
		Object.values(cwl.cwlWorkflow.steps).forEach((step: any) => {
			if (step.run?.requirements?.DockerRequirement.dockerPull) {
				delete step.run.baseCommand;
			}
		});

		const temp = Math.random().toString(36).substring(2, 15);

		console.log('Saving workflow to file');
		fs.writeFileSync(`./temp/${temp}.json`, JSON.stringify(cwl.cwlWorkflow, null, 2), 'utf-8');

		console.log('Saving job inputs to file');
		fs.writeFileSync(`./temp/${temp}-inputs.json`, JSON.stringify(cwl.cwlJobInputs, null, 2), 'utf-8');

		console.log('Starting cwltool');

		const myProcess = spawn('cwltool', [`--verbose`, `./temp/${temp}.json`, `./temp/${temp}-inputs.json`], {
			detached: true,
		});

		const pid = myProcess.pid;
		if (!pid) {
			// process failed to start
			// todo: log error
			return null;
		}

		console.log(`Process started with pid ${temp}`);

		fs.writeFileSync(`./logs/stdout-${temp}.log`, '', 'utf-8');

		myProcess.stderr.on('data', (data: any) => {
			const date = new Date().toISOString();
			data = `[time: ${date}]: ${data}`;
			fs.appendFileSync(`./logs/stdout-${temp}.log`, data, 'utf-8');
			console.log(`${data}`);
		});

		myProcess.on('error', (error: any) => {
			console.error('Failed to start child process.', error);
		});

		return buildId(pid.toString(), temp);
	}

	async getStatus(id: string) {
		const guid = getGuid(id);

		console.log('Checking logs for status');
		try {
			const log = await fs.readFileSync(`./logs/stdout-${guid}.log`, 'utf-8');
			const statusPayload = statusFromLogs(log);
			return statusPayload;
		} catch (error) {
			console.log('Log file does not exist');
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
			const log = await fs.readFileSync(`./logs/stdout-${guid}.log`, 'utf-8');
			return log;
		} catch (error) {
			return 'No logs available';
		}
	}

	async getJobLogs(id: string, jobName: string) {
		const guid = getGuid(id);
		try {
			const log = fs.readFileSync(`./logs/stdout-${guid}.log`, 'utf-8');
			return getSingleJobLogs(log, jobName);
		} catch (error) {
			return 'No logs available';
		}
	}

	async getAllJobsLogs(id: string) {
		const guid = getGuid(id);
		try {
			const log = fs.readFileSync(`./logs/stdout-${guid}.log`, 'utf-8');
			return log;
		} catch (error) {
			return 'No logs available';
		}
	}

	async getOutputs(id: string): Promise<Dictionary<any>> {
		const guid = getGuid(id);
		throw new Error('Method not implemented.');
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
