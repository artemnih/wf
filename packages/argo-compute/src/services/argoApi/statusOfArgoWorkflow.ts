import {default as axios} from 'axios';
import {argoUrl} from '.';

export interface ArgoWorkflowStatus {
  status: string;
  dateCreated: string;
  dateFinished: string;
}

export async function statusOfArgoWorkflow(
  argoWorkflowName: string,
): Promise<ArgoWorkflowStatus> {
  const response = await axios.get(`${argoUrl()}/${argoWorkflowName}`);
  return {
    status: response.data.status.phase,
    dateCreated: response.data.status.startedAt,
    dateFinished: response.data.status.finishedAt
      ? response.data.status.finishedAt
      : '',
  };
}
