import { updateStepsWithScripts } from '../../../cwl';
import { Workflow, CwlWorkflowTemplate } from '../../../types';
import { readFileSync } from 'fs';
import { expect } from '@loopback/testlab';

// base Folder path for testing purposes

const commandLineTemplate: CwlWorkflowTemplate = {
	cwlVersion: 'v1.0',
	class: 'Workflow',
	id: 'name',
	requirements: { ScatterFeatureRequirement: {} },
	inputs: {},
	outputs: {},
	steps: {},
};

function workflowToCwl(workflow: Workflow): CwlWorkflowTemplate {
	const cwlWorkflow = commandLineTemplate;
	cwlWorkflow.id = workflow.name;
	cwlWorkflow.inputs = workflow.inputParameters;
	cwlWorkflow.outputs = workflow.outputParameters;
	cwlWorkflow.steps = workflow.cwlSteps;
	cwlWorkflow.requirements = commandLineTemplate.requirements;
	return cwlWorkflow;
}

const basePathCwd = 'src/__tests__/data/doubles';

describe('Testing CWL Tools', () => {
	it('Run Echo Tool as a workflow', () => {
		const trueWorkflow: Workflow = {
			name: 'test',
			driver: 'cwl',
			id: '6171ac4137b0b158411138e4',
			inputParameters: { hello: 'string' },
			outputParameters: {},
			cwlJobInputs: { hello: 'kevin' },
			cwlSteps: {
				hello: {
					run: '612cf48ca257602c9f43f7e0',
					in: {
						hello: 'hello',
					},
					out: [],
				},
			},
		};

		const val = workflowToCwl(trueWorkflow);
		const jobs = JSON.parse(readFileSync(`${basePathCwd}/6171ac4137b0b158411138e4-jobs.json`, 'utf8'));
		const updatedWorkflow = updateStepsWithScripts(val, jobs, (script: object, runId: string, basePath) => {
			return `${basePathCwd}/612cf48ca257602c9f43f7e0.cwl`;
		});
		expect(updatedWorkflow).to.be.eql({
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'test',
			requirements: { ScatterFeatureRequirement: {} },
			inputs: { hello: 'string' },
			outputs: {},
			steps: {
				hello: {
					run: 'src/__tests__/data/doubles/612cf48ca257602c9f43f7e0.cwl',
					in: {
						hello: 'hello',
					},
					out: [],
				},
			},
		});
	});
});
