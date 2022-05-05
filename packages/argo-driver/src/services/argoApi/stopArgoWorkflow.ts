import {default as axios} from 'axios';
import {argoUrl} from './argoUrl';

export async function stopArgoWorkflow(workflowName: string): Promise<void> {
  const response = await axios.put(`${argoUrl()}/${workflowName}/terminate`);
  if (response.status !== 200) console.error(response.data);
  if (response.status === 200)
    console.log(`Workflow ${workflowName} was stopped`);
}
