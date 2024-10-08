import { Job, Workflow } from '../models';
import { workflowToCwl } from '../utils/CWLConvertors';
import { logger, workflowToJobs } from '../utils';
import DriverRepository from './driver.repository';
import { default as axios } from 'axios';
import { Dictionary, DriverRoutes } from '@polusai/compute-common';

export class WorkflowRepository {
	async submitWorkflowToDriver(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const cwlWorkflow = workflowToCwl(workflow);
		const cwlJobInputs = workflow.cwlJobInputs;
		const jobs = workflowToJobs(cwlWorkflow, workflow.cwlJobInputs);
		const url = `${driverUrl}/compute`;
		const result = await axios.post(`${url}`, { cwlWorkflow, cwlJobInputs, jobs }, { headers: { authorization: token } });
		return result.data;
	}

	async getWorkflowStatus(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.get(`${driverUrl}/compute/${workflow.driverWorkflowId}/status`, { headers: { authorization: token } });
		return result.data;
	}

	async getWorkflowOutput(workflow: Workflow, path: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const workflowId = workflow.driverWorkflowId;
		const url = DriverRoutes.OUTPUTS.replace('/:id/', `/${workflowId}/`).replace('/*', `/${path}`);
		const fullUrl = `${driverUrl}/compute/${url}`;

		logger.info(`Getting output from url ${fullUrl}`);

		return axios.get(fullUrl, {
			headers: { authorization: token },
			responseType: 'stream',
		});
	}

	async getWorkflowLogs(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.get(`${driverUrl}/compute/${workflow.driverWorkflowId}/logs`, { headers: { authorization: token } });
		return result.data;
	}

	async getAllJobsLogs(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.get(`${driverUrl}/compute/${workflow.driverWorkflowId}/all-jobs-logs`, {
			headers: { authorization: token },
		});
		return result.data;
	}

	async getWorkflowJobLogs(workflow: Workflow, jobId: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.get(`${driverUrl}/compute/${workflow.driverWorkflowId}/job/${jobId}/logs`, {
			headers: { authorization: token },
		});
		return result.data;
	}

	async getWorkflowJobStatus(workflow: Workflow, jobId: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.get(`${driverUrl}/compute/${workflow.driverWorkflowId}/job/${jobId}/status`, {
			headers: { authorization: token },
		});
		return result.data;
	}

	async getWorkflowJobs(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.get(`${driverUrl}/compute/${workflow.driverWorkflowId}/jobs`, { headers: { authorization: token } });
		return result.data as Dictionary<Job>;
	}

	async stopWorkflow(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.put(`${driverUrl}/compute/${workflow.driverWorkflowId}/stop`, {}, { headers: { authorization: token } });
		return result.data;
	}

	async pauseWorkflow(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.put(
			`${driverUrl}/compute/${workflow.driverWorkflowId}/pause`,
			{},
			{ headers: { authorization: token } },
		);
		return result.data;
	}

	async restartWorkflow(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.put(
			`${driverUrl}/compute/${workflow.driverWorkflowId}/restart`,
			{},
			{ headers: { authorization: token } },
		);
		return result.data;
	}

	async resumeWorkflow(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.put(
			`${driverUrl}/compute/${workflow.driverWorkflowId}/resume`,
			{},
			{ headers: { authorization: token } },
		);
		return result.data;
	}

	async resubmitWorkflow(workflow: Workflow, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(workflow.driver);
		const result = await axios.put(
			`${driverUrl}/compute/${workflow.driverWorkflowId}/resubmit`,
			{},
			{ headers: { authorization: token } },
		);
		return result.data;
	}

	async healthDriverCheck(driver: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(driver);
		const result = await axios.get(`${driverUrl}/health/check`);
		return result.data;
	}

	async getDriverLogs(driver: string, token: string) {
		logger.info(`Getting driver logs for ${driver}`);
		const driverObj = await DriverRepository.getByName(driver);
		const driverUrl = driverObj.url;
		const result = await axios.get(`${driverUrl}/compute/logs`, { headers: { authorization: token } });
		let rawLogs = result.data;
		rawLogs = rawLogs.replace(/\t/g, ' ');
		const logLines = rawLogs.split('\n').filter((line: string) => line.trim() !== '');
		return logLines;
	}
}

export default new WorkflowRepository();
