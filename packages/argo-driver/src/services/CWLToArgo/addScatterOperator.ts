import { readFileSync } from 'fs';
import { CLT, Step, CwlWorkflow, CwlWorkflowStep, ComputeJob } from '../../types';

export function addScatterOperator(cwlWorkflow: CwlWorkflow, steps: Step[], jobs: ComputeJob[]): [CwlWorkflow, Step[], ComputeJob[]] {
	const dynamicScatterObject = detectDynamicScatter(cwlWorkflow);
	if (!dynamicScatterObject) return [cwlWorkflow, steps, jobs];

	const filePatternScript = JSON.parse(readFileSync('src/operators/argo-file-pattern-operator.json', 'utf8')) as CLT;
	const cwlOperator: Record<string, CwlWorkflowStep> = {};
	let index = 1;
	const originalSteps = cwlWorkflow.steps;
	const expandedJobs = jobs;
	const expandedSteps = steps;
	for (const [key, val] of Object.entries(dynamicScatterObject)) {
		const operatorKey = index === 1 ? 'argoFileOperator' : `argoFileOperator-${index}`;
		expandedJobs.push({
			id: operatorKey,
			workflowId: cwlWorkflow.id,
			commandLineTool: filePatternScript,
			inputs: { input: val },
			outputs: {},
			stepName: operatorKey,
		});

		expandedSteps.push({
			workflowId: cwlWorkflow.id,
			clt: filePatternScript,
			in: { input: val },
			out: ['filePatterns'],
			name: operatorKey,
		});

		const operator: CwlWorkflowStep = {
			run: 'src/operators/argo-file-pattern-operator.json',
			in: {
				input: dynamicScatterObject[key],
			},
			out: ['filePatterns'],
		};
		cwlOperator[operatorKey] = operator;
		index = index + 1;
		cwlWorkflow.steps = { ...cwlOperator };
	}
	cwlWorkflow.steps = { ...cwlWorkflow.steps, ...originalSteps };

	return [cwlWorkflow, expandedSteps, expandedJobs];
}

function detectDynamicScatter(cwlWorkflow: CwlWorkflow): Record<string, string> {
	let dynamicScatterFound = false;
	const replaceStep: Record<string, string> = {};
	let index = 1;
	for (const [, value] of Object.entries(cwlWorkflow.steps)) {
		if (value.scatter) {
			for (const [inputKey, inputValue] of Object.entries(value.in)) {
				if (value.scatter === inputKey) {
					dynamicScatterFound = (inputValue as string).includes('/');
					if (dynamicScatterFound) {
						const operatorValue = index === 1 ? `argoFileOperator/filePatterns` : `argoFileOperator-${index}/filePatterns`;
						(value.in as Record<string, string>)[`${inputKey}`] = operatorValue;
						replaceStep[operatorValue] = inputValue as string;
						index += 1;
					}
				}
			}
		}
	}
	return replaceStep;
}
