import { Job } from '../models';
import { default as axios } from 'axios';
require('dotenv').config();
const config = require('config');

export class Driver {
	private driverUrl = '';

	constructor(
		private driver: string,
		private token: string,
	) {
		const driverInfo = config.compute.drivers[`${driver.toLowerCase()}Driver`];
		if (!driverInfo) {
			throw new Error('Driver not found');
		}

		this.driverUrl = `${driverInfo.scheme}://${driverInfo.host}:${driverInfo.port}/compute/${driver}`;
		console.log('Driver url: ', this.driverUrl);
	}

	async compute(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[], token: string) {
		console.log('Url resolved to ', this.driverUrl);
		console.log(`Posting workflow to [${this.driverUrl}]`);
		console.log('Number of jobs:', jobs.length);
		return axios.post(`${this.driverUrl}/compute`, { cwlWorkflow, cwlJobInputs, jobs }, { headers: { authorization: token } });
	}

	async health() {
		console.log(`Health check on ${this.driver}`);

		const healthUrl = this.driverUrl + `/health`;
		console.log('health url: ', healthUrl);

		const result = await axios.get(`${healthUrl}`, { headers: { authorization: this.token } });
		return result.data;
	}

	async getWorkflowStatus(workflowId: string, token: string): Promise<object> {
		console.log(`Getting workflow status for ${workflowId}`);
		console.log('Url resolved to ', `${this.driverUrl}/${workflowId}/status`);
		return (await axios.get(`${this.driverUrl}/${workflowId}/status`, { headers: { authorization: token } })).data;
	}

	async getWorkflowOutput(workflowId: string, token: string): Promise<object> {
		console.log(`Getting workflow output for ${workflowId}`);
		return (await axios.get(`${this.driverUrl}/${workflowId}/output`, { headers: { authorization: token } })).data;
	}

	async getWorkflowLogs(workflowId: string, token: string): Promise<object> {
		console.log(`Getting workflow logs for ${workflowId}`);
		return (await axios.get(`${this.driverUrl}/${workflowId}/logs`, { headers: { authorization: token } })).data;
	}

	async getWorkflowJobs(workflowId: string, token: string): Promise<object> {
		console.log(`Getting workflow jobs for ${workflowId}`);
		return (await axios.get(`${this.driverUrl}/${workflowId}/jobs`, { headers: { authorization: token } })).data;
	}

	async stopWorkflow(workflowId: string, token: string): Promise<object> {
		console.log(`Stopping workflow ${workflowId}`);
		return (await axios.put(`${this.driverUrl}/${workflowId}/stop`, {}, { headers: { authorization: token } })).data;
	}

	async pauseWorkflow(workflowId: string, token: string): Promise<object> {
		console.log(`Pausing workflow ${workflowId}`);
		return (await axios.put(`${this.driverUrl}/${workflowId}/pause`, {}, { headers: { authorization: token } })).data;
	}

	async restartWorkflow(workflowId: string, token: string): Promise<object> {
		console.log(`Restarting workflow ${workflowId}`);
		return (await axios.put(`${this.driverUrl}/${workflowId}/restart`, {}, { headers: { authorization: token } })).data;
	}

	async resumeWorkflow(workflowId: string, token: string): Promise<object> {
		console.log(`Resuming workflow ${workflowId}`);
		return (await axios.put(`${this.driverUrl}/${workflowId}/resume`, {}, { headers: { authorization: token } })).data;
	}
}
