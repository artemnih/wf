import { Job, Plugin, Workflow } from '../models';
import { workflowToCwl } from '../services/CWLConvertors';
import { existsSync, readFileSync } from 'fs';
import { PluginRepository } from '../repositories';

export async function workflowToJobs(workflowModel: Workflow, cwlJobInputs: object, pluginRepository: PluginRepository): Promise<Job[]> {
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
    const commandLineTool = await getScript(workflow.steps[element].run, pluginRepository);
    const job = new Job({
      driver: workflowModel.driver,
      workflowId: workflowModel.id ? workflowModel.id : workflowModel.name,
      status: 'PENDING',
      stepName: element,
      scriptPath: workflow.steps[element].run,
      commandLineTool: commandLineTool.cwlScript,
      inputs: inputsToConvert,
      outputs: outputsToConvert,
      dateCreated: workflowModel.dateCreated,
    });
    jobArray.push(job);
  }
  return jobArray;
}
async function getScript(path: string, pluginRepository: PluginRepository): Promise<Plugin> {
  // For unit testing, read files from disk rather than rely on repository.
  if (existsSync(path)) {
    const CLT = JSON.parse(readFileSync(path, 'utf8'));
    return new Plugin({ cwlScript: { ...CLT } });
  }
  const pathSplit = path.split(':');
  return pluginRepository.findById(pathSplit[1]);
}
