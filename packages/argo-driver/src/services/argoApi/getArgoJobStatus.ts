import {argoApiInstance} from '.';
import {ComputeJob} from '../../types';
import {getJobsFromArgoApi} from './getJobsFromArgoApi';

export interface ArgoJobStatus {
  data: {
    metadata: object;
    spec: object;
    status: {nodes: Record<string, ArgoNodes>};
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
  resourcesDuration: {cpu: number; memory: number};
  inputs?: {parameters: ArgoParameters[]};
}

export async function getArgoJobsAndUpdateComputeJobs(argoName: string) {
  const jobs = await getArgoJobStatus(argoName);
  return jobs;
}
export async function getWorkflowFromArgo(
  argoName: string,
): Promise<ArgoJobStatus> {
  const response = await argoApiInstance().get(`/${argoName}`);
  return {data: response.data};
}
export async function getArgoJobStatus(
  argoWorkflowName: string,
): Promise<ComputeJob[]> {
  const argoStatus = await getWorkflowFromArgo(argoWorkflowName);
  const jobs = getJobsFromArgoApi(argoWorkflowName, getPodNodes(argoStatus));
  return jobs;
}
export function getPodNodes(argoJobStatus: ArgoJobStatus): Array<ArgoNodes> {
  const arrayNodes: ArgoNodes[] = [];
  const argoJobNodes = argoJobStatus.data.status.nodes;
  for (const [key] of Object.entries(argoJobNodes)) {
    const value = argoJobNodes[key];
    if (value.type === 'Pod') arrayNodes.push(value);
  }
  return arrayNodes;
}
