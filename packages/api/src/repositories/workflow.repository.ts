import { Workflow } from '../models';
import { workflowToCwl } from '../utils/CWLConvertors';
import { workflowToJobs } from '../utils';
import { Driver } from '../driver';

export class WorkflowRepository {
	async submitWorkflowToDriver(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		const cwl = workflowToCwl(workflow);
		const inputs = workflow.cwlJobInputs;
		const jobs = workflowToJobs(cwl, workflow.cwlJobInputs);
		return driver.compute(cwl, inputs, jobs);
	}

	async getWorkflowStatus(workflow: Workflow, token: string) {
		const drvr = new Driver(workflow.driver, token);
		return drvr.getWorkflowStatus(workflow.driverWorkflowId);
	}

	async getWorkflowOutput(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowOutput(workflow.driverWorkflowId);
	}

	async getWorkflowLogs(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowLogs(workflow.driverWorkflowId);
	}

	async getAllJobsLogs(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.getAllJobsLogs(workflow.driverWorkflowId);
	}

	async getWorkflowJobLogs(workflow: Workflow, jobId: string, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowJobLogs(workflow.driverWorkflowId, jobId);
	}

	async getWorkflowJobStatus(workflow: Workflow, jobId: string, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowJobStatus(workflow.driverWorkflowId, jobId);
	}

	async getWorkflowJobs(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowJobs(workflow.driverWorkflowId);
	}

	async stopWorkflow(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.stopWorkflow(workflow.driverWorkflowId);
	}

	async pauseWorkflow(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.pauseWorkflow(workflow.driverWorkflowId);
	}

	async restartWorkflow(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.restartWorkflow(workflow.driverWorkflowId);
	}

	async resumeWorkflow(workflow: Workflow, token: string) {
		const driver = new Driver(workflow.driver, token);
		return driver.resumeWorkflow(workflow.driverWorkflowId);
	}

	async resubmitWorkflow(workflow: Workflow, token: string) {
		throw new Error('Not implemented');
	}

	async healthDriverCheck(driverType: string, token: string) {
		const driver = new Driver(driverType, token);
		return driver.health();
	}
}

export default new WorkflowRepository();
