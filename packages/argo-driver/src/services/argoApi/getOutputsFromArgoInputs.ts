import { ArgoParameters } from '.';

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
		console.warn(
			`The inputs on ${stepName} did not have any output data. For argo, they must match our volume config: ${argoConfig.argoCompute.volumeDefinitions.outputPath}`,
		);
	}

	return actualOutput;
}
