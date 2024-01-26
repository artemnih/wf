import { axiosClient } from '.';

type Dict<T> = { [key: string]: T };

// translate status value from Argo to Compute
export function translateStatus(phase: string) {
  switch (phase) {
    case 'Pending':
      return 'PENDING';
    case 'Running':
      return 'RUNNING';
    case 'Succeeded':
      return 'SUCCEEDED';
    case 'Failed':
      return 'FAILED';
    case 'Error':
      return 'FAILED';
    case 'Skipped':
      return 'SKIPPED';
    default:
      return phase;
  }
}

export interface ArgoWorkflowStatus {
  status: string;
  startedAt: string;
  finishedAt: string;
  progress: string;
  pods: {
    templateName: string;
    status: string;
    startedAt: string;
    finishedAt: string;
    progress: string;
  }[];
}

export async function statusOfArgoWorkflow(
  argoWorkflowName: string,
): Promise<ArgoWorkflowStatus> {
  console.log('Getting status of Argo workflow', argoWorkflowName);
  const response = await axiosClient().get(`/${argoWorkflowName}`);
  const nodes = response.data.status.nodes as Dict<any>;

  const pods =
    Object.values(nodes)
      .filter((node) => node.type === 'Pod')
      .map((node) => {
        return {
          templateName: node.templateName || '',
          status: translateStatus(node.phase),
          startedAt: node.startedAt || '',
          finishedAt: node.finishedAt || '',
          progress: node.progress || '',
        }
      });

  return {
    status: translateStatus(response.data.status.phase),
    startedAt: response.data.status.startedAt || '',
    finishedAt: response.data.status.finishedAt || '',
    progress: response.data.status.progress || '',
    pods
  };
}
