import { ComputeJob } from '../../types';
import { ArgoNodes, ArgoParameters } from './getArgoJobStatus';
import { getOutputsFromArgoInputs } from './getOutputsFromArgoInputs';
import { translateStatus } from './statusOfArgoWorkflow';

export function getJobsFromArgoApi(workflowId: string, argoNodes: Array<ArgoNodes>) {
	let index = 0;
	// Argo does not have to return the nodes in any logical order.
	// We sort the nodes for both jobs and argo nodes.  This way we enforce order.
	// Note this does mean that the jobs may not match the order in the workflow.
	const sortedArgoNodes = argoNodes.sort((a, b) => {
		const x = a.displayName.toLowerCase();
		const y = b.displayName.toLowerCase();
		return x < y ? -1 : x > y ? 1 : 0;
	});

	const jobs: ComputeJob[] = [];
	for (const argoNode of sortedArgoNodes) {
		const job: ComputeJob = {
			id: argoNode.id,
			driver: 'ARGO',
			dateCreated: argoNode.startedAt,
			workflowId,
			dateFinished: argoNode.finishedAt,
			status: translateStatus(argoNode.phase),
			stepName: argoNode.displayName,
			outputs: {
				...getOutputsFromArgoInputs(argoNode.inputs?.parameters as ArgoParameters[], argoNode.displayName),
			},
			inputs: mapArgoParametersToJobInputs(argoNode.inputs?.parameters),
		};
		jobs.push(job);
		index = index + 1;
	}
	return jobs;
}

function mapArgoParametersToJobInputs(argoParameters?: ArgoParameters[]) {
	if (!argoParameters) return {};
	const obj: Record<string, string> = {};
	argoParameters.forEach(value => {
		obj[value.name] = value.value;
	});
	return obj;
}
