import { WorkflowStatus, WorkflowStatusPayload } from '@polusai/compute-common';
import { axiosClient } from '.';

type Dict<T> = { [key: string]: T };

// translate status value from Argo to Compute
export function translateStatus(phase: string) {
	switch (phase) {
		case 'Pending':
			return WorkflowStatus.PENDING;
		case 'Running':
			return WorkflowStatus.RUNNING;
		case 'Succeeded':
			return WorkflowStatus.SUCCEEDED;
		case 'Failed':
			return WorkflowStatus.FAILED;
		case 'Error':
			return WorkflowStatus.ERROR;
		case 'Skipped':
			return WorkflowStatus.SKIPPED;
		default:
			return phase;
	}
}



export async function statusOfArgoWorkflow(argoWorkflowName: string) {
	console.log('Getting status of Argo workflow', argoWorkflowName);
	const response = await axiosClient().get(`/${argoWorkflowName}`);
	const nodes = response.data.status.nodes as Dict<any>;

	const jobs = Object.values(nodes)
		.filter(node => node.type === 'Pod')
		.filter(node => node.templateName !== 'path-creator')
		.map(node => {
			return {
				id: node.templateName || '',
				status: translateStatus(node.phase),
				startedAt: node.startedAt || '',
				finishedAt: node.finishedAt || '',
				progress: node.progress || '',
			};
		});

	return {
		status: translateStatus(response.data.status.phase),
		startedAt: response.data.status.startedAt || '',
		finishedAt: response.data.status.finishedAt || '',
		progress: response.data.status.progress || '',
		jobs: jobs,
	} as WorkflowStatusPayload;
}
