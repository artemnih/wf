import { locationFromOutput, OutputDict } from '.';
import { readCwlOutput } from './read.output';
import { readWorkflow } from './read.workflow';

export function getOutputsFromCwl(
	workflowId: string,
	jobName: string,
	scatterIndex: number,
	workflowHandler = (file: string) => {
		return readWorkflow(file);
	},
	outputHandler = (file: string) => {
		return readCwlOutput(file);
	},
): Record<string, string | string[] | number | boolean> {
	const workflow = workflowHandler(workflowId);
	const outputs = outputHandler(workflowId);
	const keys = Object.keys(workflow.steps);
	const returnObject: Record<string, string | string[] | number | boolean> = {};
	const foundValue = keys.find(value => value === jobName);
	if (foundValue) {
		const stepEntry = workflow.steps[foundValue];
		for (const [, value] of Object.entries(stepEntry.out)) {
			if (!Array.isArray(outputs[value])) {
				returnObject[value] = locationFromOutput(outputs[value] as OutputDict);
			} else {
				const arrayValue = (outputs[value] as string[])[scatterIndex] as string;
				returnObject[value] = locationFromOutput(arrayValue as unknown as OutputDict);
				if (!returnObject[value]) {
					/// This means that this output is not a FIle CWL output
					returnObject[value] = outputs[value] as string[];
				}
			}
			if (!returnObject[value] && (value.includes('StdOut') || value.includes('StdErr'))) {
				require('dotenv').config();
				const slurmConfig = require('config');
				const jobNameLog = scatterIndex === 0 ? jobName : jobName + '_' + (scatterIndex + 1);
				const logLoc = `${slurmConfig.slurmCompute.data}/${workflowId}-logs/${jobNameLog}`;
				returnObject[value] = logLoc;
			}
		}
	}
	return returnObject;
}
