import { ArgoTaskTemplate, Step, BoundOutput, WorkflowInput, ArgoTaskParameter, ArgoTaskParameterType } from '../../../types';
import { determineDependencies } from './determineDependencies';
import { sanitizeStepName } from './sanitize-step-name';
import path from 'path';
import { logger } from '../../logger';

/**
 * Build the argo dag task template for the given step.
 * @param step a worfklow step
 * @param cwlJobInputs the parsed cwlJobInputs
 * @param boundOutputs the bound outputs
 * @returns the argo dag task template.
 */
export function buildArgoDagTaskTemplate(step: Step, cwlJobInputs: WorkflowInput[], boundOutputs: BoundOutput[], pathPrefix: string) {
	// step names this step depends on
	const dependencies = determineDependencies(step);

	let { taskArgumentsParameters, scatterParam } = createTaskParameters(step, cwlJobInputs, boundOutputs, pathPrefix);

	mountDirectories(taskArgumentsParameters);

	const argoDagTemplate: ArgoTaskTemplate = {
		name: sanitizeStepName(`${step.name}`),
		template: sanitizeStepName(`${step.name}`),
		arguments: {
			parameters: taskArgumentsParameters,
		},
	};

	//TODO CHECK SCATTER
	if (step.scatter) {
		if (Array.isArray(scatterParam)) {
			argoDagTemplate.withItems = scatterParam as string[];
		} else if (typeof scatterParam === 'string') {
			argoDagTemplate.withParam = scatterParam as string;
		}
	}

	const sanitizeDependencies: string[] = [];
	if (dependencies.length > 0) {
		for (let dependency of dependencies) {
			sanitizeDependencies.push(sanitizeStepName(dependency));
		}
		argoDagTemplate.dependencies = sanitizeDependencies;
	}

	return argoDagTemplate;
}

function mountDirectories(taskArgumentsParameters: ArgoTaskParameter[]) {
	// get configuration
	require('dotenv').config();
	const argoConfig = require('config');

	for (let param of taskArgumentsParameters) {
		if (param.type === ArgoTaskParameterType.OutputPath) {
			// outputs should be mounted in writable location
			let argoMountPath = argoConfig.argoCompute.volumeDefinitions.outputPath;
			param.value = path.join(argoMountPath, param.value);
		} else if (param.type === ArgoTaskParameterType.InputPath) {
			// inputs must be mounted from a read only location
			let argoMountPath = argoConfig.argoCompute.volumeDefinitions.mountPath;
			param.value = path.join(argoMountPath, param.value);
		}
	}
}

function createTaskParameters(step: Step, cwlJobInputs: WorkflowInput[], boundOutputs: BoundOutput[], pathPrefix: string) {
	let scatterParam: string[] | string = '';
	const taskArgumentsParameters: ArgoTaskParameter[] = [];
	const templateName = step.name;

	for (const stepInput in step.in) {
		let inputValue: string = '';
		let inputType = ArgoTaskParameterType.Value;

		//for each input step, check if it is defined in the cwlJobInputs
		const workflowInput = cwlJobInputs.find(element => step.in[stepInput] === element.name);

		//Input defined in cwlJobInputs
		if (workflowInput) {
			inputValue = workflowInput.value;

			//TODO CHECK SCATTER
			if (step.scatter === stepInput) {
				inputValue = '{{item}}';
				scatterParam = workflowInput?.value;
			} else {
				warnAboutStringArrayParameters(inputValue);
			}

			if (step.clt.inputs[stepInput]?.type == 'Directory') {
				// if this step is an output, then it is generated by this workflow
				// and we need to prefix it.
				if (step.out.includes(stepInput)) {
					// We keep the previous decision of prepending paths with the
					// current step name. This may be revisited later on.
					inputValue = path.join(pathPrefix, step.name, inputValue);
					inputType = ArgoTaskParameterType.OutputPath;
				}
				// if step is an input, it could come from anywhere so
				// we just use it as is.
				else {
					inputType = ArgoTaskParameterType.InputPath;
				}
			}
		}
		// This parameter depends on a previous output.
		else {
			// The input parameter has the special syntax: previoustep/outputname
			const dependentInput = step.in[stepInput].split('/');
			if (dependentInput.length !== 2) {
				const errorMessage = `Invalid ${stepInput} for step ${templateName}. Should be a dependent input in the form dependentStepName/dependentInputName`;
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}
			let [boundStep, boundOutput] = dependentInput;

			const boundInput = boundOutputs.find(element => boundStep == element.stepName && boundOutput === element.outputName);

			if (!boundInput) {
				const errorMessage = `boundInput ${boundStep}/${boundOutput} is incorrectly defined.`;
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}

			const workflowInput = cwlJobInputs.find(cwlJobInput => boundInput.inputName === cwlJobInput.name);

			if (!workflowInput) {
				const errorMessage = `boundInput ${boundInput.inputName} must be defined in cwlJobInputs.`;
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}

			inputValue = workflowInput.value;

			// If we have directory, it means we are depending on data created by a previous step.
			// We need to mount the directory into a read-only location coming from the given step.
			if (step.clt.inputs[stepInput]?.type == 'Directory') {
				inputValue = path.join(pathPrefix, boundStep, inputValue as string);
				inputType = ArgoTaskParameterType.InputPath;
			}
		}

		const parameter = {
			name: `${stepInput}`,
			value: inputValue,
			type: inputType,
		};
		taskArgumentsParameters.push(parameter);
	}

	return { taskArgumentsParameters, scatterParam };
}

function warnAboutStringArrayParameters(value: string | string[] | undefined): void {
	if (Array.isArray(value)) {
		logger.warn(
			"Argo driver does not handle array parameters in the dag spec.  Please remove square brackets and pass a string list ie 'r,xy'",
		);
	}
}
