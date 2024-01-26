import { getOutputsFromCwl } from '.';
import { FileOrDirectoryInput } from '../types';
import { readCwlOutput } from './read.output';
import { readWorkflow } from './read.workflow';
import { readParameters } from './read.parameters';

export function getInputsFromCwl(
	workflowId: string,
	jobName: string,
	scatterIndex: number,
	workflowHandler = (file: string) => {
		return readWorkflow(file);
	},
	parametersHandler = (file: string) => {
		return readParameters(file);
	},
	outputHandler = (file: string) => {
		return readCwlOutput(file);
	},
) {
	const workflow = workflowHandler(workflowId);
	const parameters = parametersHandler(workflowId);
	const getStringValue = (value: FileOrDirectoryInput | string) => {
		if (typeof value === 'object') {
			return value.path;
		} else {
			return value;
		}
	};
	const keys = Object.keys(workflow.steps);
	const returnObject: Record<string, string> = {};
	const foundValue = keys.find(value => value === jobName);
	if (foundValue) {
		const stepEntry = workflow.steps[foundValue];
		for (const [key, value] of Object.entries(stepEntry.in)) {
			let stringValue = parameters[value] as string | FileOrDirectoryInput;
			/// Condition 1: If scatter is specified and input is defined, then we can display that value.
			/// Condtion 2: If scatter is specified but input depends on other job, then we do not support at this moment.
			if (stepEntry.scatter === key) {
				if ((value as string).includes('/')) {
					stringValue = 'dynamic scatter not supported';
				} else {
					stringValue = (parameters[value] as string[])[scatterIndex];
				}
			}
			const dependencyInput = (value as string).split('/');
			if (dependencyInput.length > 1 && stepEntry.scatter !== key) {
				const outputs = getOutputsFromCwl(workflowId, dependencyInput[0], scatterIndex, workflowHandler, outputHandler);
				stringValue = outputs[dependencyInput[1]] as string;
			}
			returnObject[key] = getStringValue(stringValue);
		}
	}
	return returnObject;
}
