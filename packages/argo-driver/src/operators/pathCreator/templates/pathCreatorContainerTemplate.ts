import { CONFIG } from '../../../config';
import { ArgoContainerTemplate } from '../../../types';

export function pathCreatorContainerTemplate(): ArgoContainerTemplate {
	return {
		name: 'path-creator',
		inputs: {
			parameters: [{ name: 'paths' }],
		},
		container: {
			image: 'agerardin/argo-step-path-creator:0.0.1',
			command: ['python3', '-m', 'argo.steps.path_creator'],
			args: ['--paths', '{{inputs.parameters.paths}}'],
			volumeMounts: [
				{
					name: CONFIG.argoCompute.volumeDefinitions.name,
					readOnly: true,
					mountPath: CONFIG.argoCompute.volumeDefinitions.mountPath,
				},
				{
					name: CONFIG.argoCompute.volumeDefinitions.name,
					mountPath: `${CONFIG.argoCompute.volumeDefinitions.outputPath}`,
					subPath: `${CONFIG.argoCompute.volumeDefinitions.subPath}`,
					readOnly: false,
				},
			],
		},
	};
}
