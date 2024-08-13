import { WorkflowStatus } from '@polusai/compute-common';
import { axiosClient } from '.';
import { sanitizeStepName } from '../CWLToArgo/utils/sanitize-step-name';
import { getJobsFromArgoApi } from './getJobsFromArgoApi';
import { translateStatus } from './statusOfArgoWorkflow';
import { logger } from '@polusai/compute-common';

export interface ArgoJobStatus {
	data: {
		metadata: object;
		spec: object;
		status: { nodes: Record<string, ArgoNodes> };
	};
}

export interface ArgoParameters {
	name: string;
	value: string;
}

export interface ArgoNodes {
	id: string;
	name: string;
	displayName: string;
	templateName: string;
	type: string;
	phase: string;
	startedAt: string;
	finishedAt: string;
	progess: string;
	resourcesDuration: { cpu: number; memory: number };
	inputs?: { parameters: ArgoParameters[] };
}

export async function getArgoJobStatus(argoWorkflowName: string) {
	const argoStatus = (await axiosClient().get(`/${argoWorkflowName}`)) as ArgoJobStatus;
	const pods = Object.values(argoStatus.data.status.nodes).filter(value => value.type === 'Pod') as Array<ArgoNodes>;
	const jobs = getJobsFromArgoApi(argoWorkflowName, pods);
	return jobs;
}

export async function getJobStatus(workflowId: string, jobName: string) {
	logger.info(`Getting status for job "${jobName}" in workflow "${workflowId}"`);
	try {
		const workflow = (await axiosClient().get(`/${workflowId}`)) as ArgoJobStatus;
		const pods = Object.values(workflow.data.status.nodes).filter(value => value.type === 'Pod') as Array<ArgoNodes>;
		const sanitizedStepName = sanitizeStepName(jobName);
		const pod = pods.find(pod => pod.templateName === sanitizedStepName);
		if (!pod) {
			const errorMessage = `Pod "${sanitizedStepName}" not found in workflow "${workflowId}"`;
			logger.error(errorMessage);
			throw new Error(errorMessage);
		}
		return translateStatus(pod.phase);
	} catch (err) {
		return translateStatus(WorkflowStatus.ERROR);
	}
}
