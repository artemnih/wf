import { ArgoParameters } from '.';
import { logger } from '../logger';

function checkIfOutput(inputValue: string): boolean {
	require('dotenv').config();
	const argoConfig = require('config');

	return inputValue.startsWith(`${argoConfig.argoCompute.volumeDefinitions.outputPath}`);
}

export function getOutputsFromArgoInputs(inputs: ArgoParameters[], stepName: string) {
	require('dotenv').config();
	const argoConfig = require('config');
	const actualOutput: Record<string, string> = {};

	for (const element of inputs) {
		if (checkIfOutput(element.value)) {
			const pathInArgo = element.value.replace(
				`${argoConfig.argoCompute.volumeDefinitions.outputPath}`,
				`${argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath}`,
			);
			actualOutput[`${stepName}${element.name}`] = pathInArgo;
		}
	}

	if (Object.keys(actualOutput).length === 0) {
		logger.warn(
			`The inputs on ${stepName} did not have any output data. For argo, they must match our volume config: ${JSON.stringify(
				argoConfig.argoCompute.volumeDefinitions.outputPath,
			)}`,
		);
	}

	return actualOutput;
}
