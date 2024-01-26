export interface StepTemplate {
	run: string;
	scatter?: string;
	in: object;
	out: string[];
}
export interface CwlWorkflowTemplate {
	cwlVersion: string;
	class: string;
	id: string;
	requirements: object;
	inputs: object;
	outputs: object;
	steps: Record<string, StepTemplate>;
}
export interface Workflow {
	name: string;
	id: string;
	driver: string;
	inputParameters: object;
	outputParameters: object;
	cwlSteps: Record<string, StepTemplate>;
	cwlJobInputs: object;
}
export interface FileOrDirectoryInput {
	class: string;
	path: string;
}
