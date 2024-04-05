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
	const wfId = response.data.metadata.name;

	const jobs = Object.values(nodes)
		.filter(node => node.type === 'Pod')
		.filter(node => node.templateName !== 'path-creator') // temp
		.map(node => {
			const id = (node.templateName || '').replace(/-/g, '_');
			// extract input parameters
			const inputs = node.inputs.parameters as Array<{ name: string; value: string; isDir: boolean }>;

			// if param value contains wfId, then it is a directory path, remove everyting before wfId
			// so that we do not expose the full path
			inputs.forEach(param => {
				if (param.value.includes(wfId)) {
					// split it
					const parts = param.value.split(wfId);

					// store it
					param.value = parts[1];

					// mark it as directory reference
					param.isDir = true;
				}
			});

			return {
				id: id,
				inputs: inputs,
				status: translateStatus(node.phase),
				startedAt: node.startedAt || '',
				finishedAt: node.finishedAt || '',
			};
		});

	return {
		id: wfId,
		status: translateStatus(response.data.status.phase),
		startedAt: response.data.status.startedAt || '',
		finishedAt: response.data.status.finishedAt || '',
		jobs: jobs,
	} as WorkflowStatusPayload;
}
