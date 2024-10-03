import { sanitizeStepName } from './sanitize-step-name';
import { Step, ArgoContainerTemplate } from '../../../types';
import { logger } from '../../logger';
import { CONFIG } from '../../../config';

/**
 * Build the container template for a given step.
 * @param step the workflow step
 * @returns the container template for this step.
 */
export function buildArgoContainerTemplate(step: Step) {
	const containerArgs: string[] = [];
	const parameterNames: { name: string }[] = [];
	const templateName = step.name;

	for (const stepInput in step.in) {
		parameterNames.push({ name: stepInput });
		const containerArg = buildContainerArg(stepInput, step);
		containerArgs.push(...containerArg);
	}

	const argoContainerTemplate: ArgoContainerTemplate = {
		name: sanitizeStepName(templateName),
		inputs: {
			parameters: parameterNames,
		},
		container: {
			image: step.clt.requirements.DockerRequirement.dockerPull,
			command: step.clt.baseCommand[0] === '' ? [] : step.clt.baseCommand,
			args: containerArgs,
			volumeMounts: [
				{
					name: CONFIG.argoCompute.volumeDefinitions.name,
					readOnly: true,
					mountPath: CONFIG.argoCompute.volumeDefinitions.mountPath,
				},
				{
					name: CONFIG.argoCompute.volumeDefinitions.name,
					mountPath: CONFIG.argoCompute.volumeDefinitions.outputPath,
					subPath: CONFIG.argoCompute.volumeDefinitions.subPath,
					readOnly: false,
				},
			],
		},
	};

	return argoContainerTemplate;
}

/**
 * Build a container argument for this step.
 * @param inputParam the input parameter to create a container argument for
 * @param step the step we building a container argument for
 * @returns an optional container arg name and its value
 */
function buildContainerArg(inputParam: string, step: Step): string[] {
	// check if the step input is also defined in the clt definition
	if (!step.clt.inputs[inputParam]) {
		const errorMessage = `The value ${inputParam} was not found in ${step.clt.inputs}`;
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}

	//extract container argument name from the clt definition
	let argName = step.clt.inputs[inputParam].inputBinding.prefix;
	let argValue = `{{inputs.parameters.${inputParam}}}`;

	if (argName) {
		// For array inputs, CWL requires a = after the prefix.
		// This is invalid in Argo so we remove it.
		// TODO CHECK the spec
		// Address and remove original comment above
		// for example, if it is trailing, just use substring instead.
		argName = argName.replace('=', '');

		// ex : ['--name','{{inputs.parameters.name}}']
		return [argName, argValue];
	} else {
		//TODO CHECK the spec
		// to see if this is handled properly
		// we have a flag, just pass the value through
		return [argValue];
	}
}
