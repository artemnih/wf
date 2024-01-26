import { ArgoTaskTemplate } from '../../../types';

export function pathCreatorTaskTemplate(stepName: string, pathsToCreate: string): ArgoTaskTemplate {
	return {
		name: stepName,
		template: 'path-creator',
		arguments: {
			parameters: [
				{
					name: 'paths',
					value: pathsToCreate,
				},
			],
		},
	};
}
