import { axiosClient } from '.';
import { getJobsFromArgoApi } from './getJobsFromArgoApi';

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
