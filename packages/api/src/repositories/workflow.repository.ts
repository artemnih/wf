import { Workflow } from '../models';
import { Driver } from '../drivers';
import { workflowToCwl, cwlJobInputs } from '../utils/CWLConvertors';
import { DriverFactory } from '../drivers';
import { workflowToJobs } from '../utils';

export class WorkflowRepository {
	changeDriver(workflow: Workflow) {
		if (workflow.driver) {
			console.log(`Changing your driver to ${workflow.driver}`);
			return DriverFactory.createDriver(workflow.driver);
		}
		throw new Error('Driver not found');
	}

	async submitWorkflowToDriver(workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		console.info('Workflow submitted: ', workflow);
		const jobs = await workflowToJobs(workflow, workflow.cwlJobInputs);
		return driver.compute(workflowToCwl(workflow), cwlJobInputs(workflow), jobs, token);
	}

	async getWorkflowStatus(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.getWorkflowStatus(id, token);
	}

	async getWorkflowOutput(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.getWorkflowOutput(id, token);
	}

	async getWorkflowLogs(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.getWorkflowLogs(id, token);
	}

	async getWorkflowJobs(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.getWorkflowJobs(id, token);
	}

	async stopWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.stopWorkflow(id, token);
	}

	async pauseWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.pauseWorkflow(id, token);
	}

	async restartWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.restartWorkflow(id, token);
	}

	async resumeWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = this.changeDriver(workflow);
		return driver.resumeWorkflow(id, token);
	}

	async resubmitWorkflow(workflow: Workflow, token: string): Promise<object> {
		return this.submitWorkflowToDriver(workflow, token);
	}

	async healthDriverCheck(driverType: string, token: string): Promise<object> {
		const driver = this.changeDriver({ driver: driverType } as Workflow);
		return driver.health(driverType, token);
	}
}

export default new WorkflowRepository();
