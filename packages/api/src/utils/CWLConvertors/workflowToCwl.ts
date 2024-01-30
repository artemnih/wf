import { Workflow } from '../../models';

export interface StepTemplate {
	run: string;
	in: object;
	out: string[];
}
export interface CwlWorkflowTemplate {
	cwlVersion: string;
	class: string;
	requirements: object;
	id: string;
	inputs: object;
	outputs: object;
	steps: Record<string, StepTemplate>;
}

function commandLineTemplate(): CwlWorkflowTemplate {
	return {
		cwlVersion: 'v1.2',
		class: 'Workflow',
		id: 'name',
		requirements: {
			ScatterFeatureRequirement: {},
			InlineJavascriptRequirement: {},
		},
		inputs: {},
		outputs: {},
		steps: {},
	};
}

export function getRfc1123Name(name: string): string {
	let s = name;
	// replace spaces with dashes
	s = s.replace(/ /g, '-');
	// remove all non-alphanumeric characters except dashes
	s = s.replace(/[^a-zA-Z0-9_]/g, '');
	// remove all dashes at the beginning
	s = s.replace(/^_*/, '');
	// remove all dashes at the end
	s = s.replace(/_*$/, '');
	// replace multiple dashes with a single one
	s = s.replace(/_+/g, '-');
	// convert to lower case
	s = s.toLowerCase();
	// limit to 49 characters (63 = 49 + 10 for timestamp, 1 for dash, 3 for random number)
	s = s.substring(0, 49);
	// add unix timestamp
	s = s + '-' + Date.now();
	// add random 3-digit number
	s = s + Math.floor(Math.random() * 1000);
	return s;
}

export function workflowToCwl(workflow: Workflow): CwlWorkflowTemplate {
	const cwlWorkflow = commandLineTemplate();
	cwlWorkflow.id = getRfc1123Name(workflow.name || 'workflow');
	cwlWorkflow.inputs = workflow.inputs;
	cwlWorkflow.outputs = workflow.outputs;
	cwlWorkflow.steps = workflow.steps as Record<string, StepTemplate>;
	return cwlWorkflow;
}

export function cwlJobInputs(workflow: Workflow): object {
	return workflow.cwlJobInputs;
}
