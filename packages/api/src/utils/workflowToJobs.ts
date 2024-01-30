import { Job } from '../models';
import { CwlWorkflowTemplate } from './CWLConvertors';

export function workflowToJobs(workflow: CwlWorkflowTemplate, cwlJobInputs: object) {
	const jobArray: Job[] = [];
	const jobKeyValue = Object.entries(cwlJobInputs);
	for (const element in workflow.steps) {
		const inputsToConvert: Record<string, string> = {};
		const outputsToConvert: Record<string, string> = {};
		for (const [input, value] of Object.entries(workflow.steps[element].in)) {
			const foundJobParam = jobKeyValue.find(key => key[0] === value);
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
		workflow.steps[element].out.forEach(value => {
			outputsToConvert[value] = '';
		});
		const commandLineTool = {
			cwlScript: { ...(workflow.steps[element].run as Object) },
		};
		const job = {
			status: 'PENDING',
			stepName: element,
			commandLineTool: commandLineTool.cwlScript,
			inputs: inputsToConvert,
			outputs: outputsToConvert,
		} as Job;
		jobArray.push(job);
	}
	return jobArray;
}
