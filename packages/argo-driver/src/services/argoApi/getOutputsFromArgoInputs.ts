import { CONFIG } from '../../config';
import { ArgoParameters } from '.';
import { logger } from '../logger';

function checkIfOutput(inputValue: string): boolean {
	return inputValue.startsWith(`${CONFIG.argoCompute.volumeDefinitions.outputPath}`);
}

export function getOutputsFromArgoInputs(inputs: ArgoParameters[], stepName: string) {
	const actualOutput: Record<string, string> = {};

	for (const element of inputs) {
		if (checkIfOutput(element.value)) {
			const pathInArgo = element.value.replace(
				`${CONFIG.argoCompute.volumeDefinitions.outputPath}`,
				`${CONFIG.argoCompute.volumeDefinitions.mountPath}`,
			);
			actualOutput[`${stepName}${element.name}`] = pathInArgo;
		}
	}

	if (Object.keys(actualOutput).length === 0) {
		logger.warn(
			`The inputs on ${stepName} did not have any output data. For argo, they must match our volume config: ${JSON.stringify(
				CONFIG.argoCompute.volumeDefinitions.outputPath,
			)}`,
		);
	}

	return actualOutput;
}
