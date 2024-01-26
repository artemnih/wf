import { CLT } from './compute';

export interface Step {
	workflowId: string; //id of the workflow this step is part of
	clt: CLT;
	name: string;
	in: Record<string, string>;
	out: string[];
	scatter?: string;
	when?: string;
}

export interface BoundOutput {
	stepName?: string; // name of the step's output
	outputName?: string; // the name of the bound output parameter
	inputName?: string; // the name of the input parameter it is bound to
}

export interface WorkflowInput {
	name: string;
	value: string;
}
