import { Dictionary, IWorkflowService, WorkflowStatus } from '@polusai/compute-common';

const fs = require('fs');
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

		const myProcess = spawn('cwltool', [`./temp/${temp}.json`, `./temp/${temp}-inputs.json`], {
			detached: true,
		});

		const pid = myProcess.pid;
		if (!pid) {
			return null;
		}
		console.log(`Process started with pid ${pid}`);

		fs.writeFileSync(`./loggings/stdout-${pid}.log`, '', 'utf-8');

		myProcess.stderr.on('data', (data: any) => {
			fs.appendFileSync(`./loggings/stdout-${pid}.log`, data, 'utf-8');
			console.error(`${data}`);
		});

		myProcess.on('error', (error: any) => {
			console.error('Failed to start child process.', error);
		});

		return pid;
	}

	async getStatus(pids: string) {
		const pid = parseInt(pids);
		console.log('Checking status of process', pid);

		try {
			const result = process.kill(pid, 0);
			return { status: WorkflowStatus.RUNNING };
		} catch (error) {
			// process no longer exists
			if (error.code === 'ESRCH') {
				console.log('Process does not exist, it may have finished');
				return { status: WorkflowStatus.SUCCEEDED };
			}

			// permission denied
			if (error.code === 'EPERM') {
				console.log('Permission denied, process exists but we dont have permission to signal it');
				return { status: WorkflowStatus.ERROR };
			}

			return { status: WorkflowStatus.ERROR };
		}
	}

	async getLogs(id: string) {
		try {
			const log = fs.readFileSync(`./loggings/stdout-${id}.log`, 'utf-8');
			return log;
		} catch (error) {
			return 'No logs available';
		}
	}

	async getOutputs(id: string): Promise<Dictionary<any>> {
		throw new Error('Method not implemented.');
	}

	async getJobs(id: string): Promise<Dictionary<any>> {
		throw new Error('Method not implemented.');
	}

	async stop(pid: string) {
		try {
			const result = process.kill(parseInt(pid), 'SIGTERM');
			return 'Process stopped';
		} catch (error) {
			return 'Process not running';
		}
	}
}

export default new WorkflowService();
