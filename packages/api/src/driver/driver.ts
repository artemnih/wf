import { WorkflowStatus } from '@polusai/compute-common';
import { Job } from '../models';
import { default as axios } from 'axios';
import ConfigService from '../services/config.service';

export class Driver {
	private driverUrl = '';

	constructor(
		private driver: string,
		private token: string,
	) {
		console.log('Driver:', driver);
		const config = ConfigService.config;
		const driverInfo = config.compute.drivers[`${driver.toLowerCase()}Driver`];
		if (!driverInfo) {
			console.log('Driver not found');
			throw new Error('Driver not found');
		}

		this.driverUrl = `${driverInfo.scheme}://${driverInfo.host}:${driverInfo.port}/compute`;
		console.log('Driver url: ', this.driverUrl);
	}

	async compute(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[]) {
		console.log('Number of jobs:', jobs.length);
		console.log(`Posting workflow to: ${this.driverUrl}`);
		return (await axios.post(`${this.driverUrl}`, { cwlWorkflow, cwlJobInputs, jobs }, { headers: { authorization: this.token } }))
			.data;
	}

	async health() {
		console.log(`Health check on ${this.driver}`);
		const healthUrl = this.driverUrl + `/health`;
		console.log('Getting health at url', healthUrl);
		const result = await axios.get(`${healthUrl}`, { headers: { authorization: this.token } });
		return result.data;
	}

	async getWorkflowStatus(id: string): Promise<{ status: WorkflowStatus; dateFinished: string }> {
		console.log(`Getting workflow status for ${id}`);
		return (await axios.get(`${this.driverUrl}/${id}/status`, { headers: { authorization: this.token } })).data;
	}

	async getWorkflowOutput(id: string): Promise<object> {
		console.log(`Getting workflow output for ${id}`);
		return (await axios.get(`${this.driverUrl}/${id}/outputs`, { headers: { authorization: this.token } })).data;
	}

	async getWorkflowLogs(id: string): Promise<object> {
		console.log(`Getting workflow logs for ${id}`);
		return (await axios.get(`${this.driverUrl}/${id}/logs`, { headers: { authorization: this.token } })).data;
	}

	async getAllJobsLogs(id: string): Promise<object> {
		console.log(`Getting all jobs logs for ${id}`);
		return (await axios.get(`${this.driverUrl}/${id}/all-jobs-logs`, { headers: { authorization: this.token } })).data;
	}

	async getWorkflowJobLogs(id: string, jobId: string): Promise<object> {
		console.log(`Getting workflow job logs for ${id} and ${jobId}`);
		return (await axios.get(`${this.driverUrl}/${id}/job/${jobId}/logs`, { headers: { authorization: this.token } })).data;
	}

	async getWorkflowJobStatus(id: string, jobId: string): Promise<object> {
		console.log(`Getting workflow job status for ${id} and ${jobId}`);
		return (await axios.get(`${this.driverUrl}/${id}/job/${jobId}/status`, { headers: { authorization: this.token } })).data;
	}

	async getWorkflowJobs(id: string): Promise<object> {
		console.log(`Getting workflow jobs for ${id}`);
		return (await axios.get(`${this.driverUrl}/${id}/jobs`, { headers: { authorization: this.token } })).data;
	}

	async stopWorkflow(id: string): Promise<object> {
		console.log(`Stopping workflow ${id}`);
		return (await axios.put(`${this.driverUrl}/${id}/stop`, {}, { headers: { authorization: this.token } })).data;
	}

	async pauseWorkflow(id: string): Promise<object> {
		console.log(`Pausing workflow ${id}`);
		return (await axios.put(`${this.driverUrl}/${id}/pause`, {}, { headers: { authorization: this.token } })).data;
	}

	async restartWorkflow(id: string): Promise<object> {
		console.log(`Restarting workflow ${id}`);
		return (await axios.put(`${this.driverUrl}/${id}/restart`, {}, { headers: { authorization: this.token } })).data;
	}

	async resumeWorkflow(id: string): Promise<object> {
		console.log(`Resuming workflow ${id}`);
		return (await axios.put(`${this.driverUrl}/${id}/resume`, {}, { headers: { authorization: this.token } })).data;
	}
}
