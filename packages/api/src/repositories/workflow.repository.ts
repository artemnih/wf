import { Workflow } from '../models';
import { workflowToCwl, cwlJobInputs } from '../utils/CWLConvertors';
import { workflowToJobs } from '../utils';
import { Driver } from '../driver';

export class WorkflowRepository {
	async submitWorkflowToDriver(workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		const jobs = await workflowToJobs(workflow, workflow.cwlJobInputs);
		return driver.compute(workflowToCwl(workflow), cwlJobInputs(workflow), jobs, token);
	}

	async getWorkflowStatus(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowStatus(id, token);
	}

	async getWorkflowOutput(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowOutput(id, token);
	}

	async getWorkflowLogs(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowLogs(id, token);
	}

	async getWorkflowJobs(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.getWorkflowJobs(id, token);
	}

	async stopWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.stopWorkflow(id, token);
	}

	async pauseWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.pauseWorkflow(id, token);
	}

	async restartWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.restartWorkflow(id, token);
	}

	async resumeWorkflow(id: string, workflow: Workflow, token: string): Promise<object> {
		const driver = new Driver(workflow.driver, token);
		return driver.resumeWorkflow(id, token);
	}

	async resubmitWorkflow(workflow: Workflow, token: string): Promise<object> {
		return this.submitWorkflowToDriver(workflow, token);
	}

	async healthDriverCheck(driverType: string, token: string): Promise<object> {
		const driver = new Driver(driverType, token);
		return driver.health();
	}
}

export default new WorkflowRepository();
