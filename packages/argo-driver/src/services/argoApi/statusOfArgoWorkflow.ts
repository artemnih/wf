import {argoApiInstance} from '.';

export interface ArgoWorkflowStatus {
  status: string;
  dateCreated: string;
  dateFinished: string;
}

export async function statusOfArgoWorkflow(
  argoWorkflowName: string,
): Promise<ArgoWorkflowStatus> {
  const response = await argoApiInstance().get(`/${argoWorkflowName}`);
  return {
    status: response.data.status.phase,
    dateCreated: response.data.status.startedAt,
    dateFinished: response.data.status.finishedAt
      ? response.data.status.finishedAt
      : '',
  };
}
