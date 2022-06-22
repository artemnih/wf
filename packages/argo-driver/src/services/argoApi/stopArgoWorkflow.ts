import {argoApiInstance} from '.';

export async function stopArgoWorkflow(workflowName: string): Promise<void> {
  const response = await argoApiInstance().put(`/${workflowName}/terminate`);
  if (response.status !== 200) console.error(response.data);
  if (response.status === 200)
    console.log(`Workflow ${workflowName} was stopped`);
}
