import { readFileSync } from 'fs';
import { Job, getWorkflowLogs, readCwlOutput, getOutputOfJobs } from '../cwl';
import { HpcCli, stopWorkflow, statusOfJobs, statusOfEachJob, HPCStatus, toilKillHandler } from '../hpc';
import { WorkflowStatus } from '../types';
import { spawnGenericCwlRunner } from '../cwl/spawn.cwl';
const slurmConfig = require('config');

export class SlurmRepository {
	public async computeCwlFile(cwlFile: string, cwlJobInputs: string, outputDir: string, logsDir: string, config: string[]) {
		return spawnGenericCwlRunner(cwlFile, cwlJobInputs, outputDir, logsDir, config);
	}

	public async stopWorkflow(id: string, hpcCli: HpcCli, toilHandler = toilKillHandler) {
		stopWorkflow(id, hpcCli, toilHandler);
	}

	public async getWorkflowJobs(id: string, hpcCli: HpcCli): Promise<HPCStatus[] | object> {
		const hpcStatuses = statusOfJobs(id, hpcCli);
		if (hpcStatuses.length > 0) {
			return statusOfEachJob(hpcStatuses);
		} else {
			return {};
		}
	}

	public async getWorkflowStatus(statusPath: string): Promise<WorkflowStatus> {
		const statusWorkflow = JSON.parse(readFileSync(statusPath, 'utf8'));
		return statusWorkflow;
	}

	public async getWorkflowLogs(id: string): Promise<Record<string, string | string[] | number | boolean>> {
		require('dotenv').config();
		const slurmConfig = require('config');
		const logs = getWorkflowLogs(readCwlOutput(id));
		if (Object.keys(logs).length === 0) {
			return {
				message: `Logs of running workflow can be found in the folder ${slurmConfig.slurmCompute.data}/${id}-logs`,
			};
		}
		return logs;
	}

	public async getWorkflowLogs2(id: string): Promise<Record<string, string | string[] | number | boolean>> {
		require('dotenv').config();
		const slurmConfig = require('config');
		const logs = getWorkflowLogs(readCwlOutput(id));
		if (Object.keys(logs).length === 0) {
			return {
				message: `Logs of running workflow can be found in the folder ${slurmConfig.slurmCompute.data}/${id}-logs`,
			};
		}
		return logs;
	}

	public async getWorkflowOutputs(id: string) {
		const outputs = getOutputOfJobs(readCwlOutput(id));
		if (Object.keys(outputs).length === 0) {
			return {
				message: 'Outputs are not available while the workflow is running',
			};
		}
		return outputs;
	}
}

export default new SlurmRepository();
