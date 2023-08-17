import { Job, Plugin, Workflow } from '../models';
import { workflowToCwl } from '../services/CWLConvertors';

export async function workflowToJobs(workflowModel: Workflow, cwlJobInputs: object): Promise<Job[]> {
  const workflow = workflowToCwl(workflowModel);

  const jobArray: Job[] = [];
  const jobKeyValue = Object.entries(cwlJobInputs);
  for (const element in workflow.steps) {
    const inputsToConvert: Record<string, string> = {};
    const outputsToConvert: Record<string, string> = {};
    for (const [input, value] of Object.entries(workflow.steps[element].in)) {
      const foundJobParam = jobKeyValue.find((key) => key[0] === value);
      if (foundJobParam) {
        let jobInput = foundJobParam[1];
        if (typeof jobInput === 'object' && 'path' in jobInput) {
          jobInput = jobInput['path'];
        }
        inputsToConvert[input] = jobInput;
      } else {
        // For inputs that don't match the normal syntax, we assume that there are outputs form a previous job.
        // The driver impl should really implement updates of running jobs.
        inputsToConvert[input] = value;
      }
    }
    workflow.steps[element].out.forEach((value) => {
      outputsToConvert[value] = '';
    });
    const commandLineTool = new Plugin({ cwlScript: { ...workflow.steps[element].run as Object} });
    const job = new Job({
      driver: workflowModel.driver,
      workflowId: workflowModel.id ? workflowModel.id : workflowModel.name,
      status: 'PENDING',
      stepName: element,
      commandLineTool: commandLineTool.cwlScript,
      inputs: inputsToConvert,
      outputs: outputsToConvert,
      dateCreated: workflowModel.dateCreated,
    });
    jobArray.push(job);
  }
  return jobArray;
}