import {MinimalJob} from '../../types';
import {ArgoNodes, ArgoParameters} from './getArgoJobStatus';
import {buildContainerUrl} from './buildContainerUrl';
import {getOutputsFromArgoInputs} from './getOutputsFromArgoInputs';
export function getJobsFromArgoApi(
  workflowId: string,
  argoNodes: Array<ArgoNodes>,
): MinimalJob[] {
  let index = 0;
  // Argo does not have to return the nodes in any logical order.
  // We sort the nodes for both jobs and argo nodes.  This way we enforce order.
  // Note this does mean that the jobs may not match the order in the workflow.
  const sortedArgoNodes = argoNodes.sort((a, b) => {
    const x = a.displayName.toLowerCase();
    const y = b.displayName.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
  const jobs: MinimalJob[] = [];
  for (const argoNode of sortedArgoNodes) {
    const job: MinimalJob = {
      driver: 'ARGO',
      dateCreated: argoNode.startedAt,
      workflowId,
      dateFinished: argoNode.finishedAt,
      status: argoNode.phase,
      stepName: argoNode.displayName,
      outputs: {
        ...getOutputsFromArgoInputs(
          argoNode.inputs?.parameters as ArgoParameters[],
          argoNode.displayName,
        ),
        ...setArgoContainerUrl(argoNode.displayName, workflowId, argoNode.id),
      },
      inputs: mapArgoParametersToJobInputs(argoNode.inputs?.parameters),
    };
    jobs.push(job);
    index = index + 1;
  }
  return jobs;
}
function setArgoContainerUrl(
  stepName: string,
  workflowId: string,
  argoPodName: string,
): Record<string, string> {
  const newOutputLogs: Record<string, string> = {};
  newOutputLogs[`${stepName}Logs`] = buildContainerUrl(workflowId, argoPodName);
  return newOutputLogs;
}
function mapArgoParametersToJobInputs(
  argoParameters?: ArgoParameters[],
): object {
  if (!argoParameters) return {};
  const obj: Record<string, string> = {};
  argoParameters.forEach((value) => {
    obj[value.name] = value.value;
  });
  return obj;
}
