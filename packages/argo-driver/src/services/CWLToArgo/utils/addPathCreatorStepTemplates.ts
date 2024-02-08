import { pathCreatorTaskTemplate } from '../../../operators/pathCreator/templates/pathCreatorTaskTemplate';
import { pathCreatorContainerTemplate } from '../../../operators/pathCreator/templates/pathCreatorContainerTemplate';
import { ArgoTaskTemplate, ArgoContainerTemplate, ArgoTaskParameterType } from '../../../types';

/**
 * Add task and container templates for the path creator to the
 * existing steps and update step dependencies.
 * @param generatedTemplates the list of steps that may need output paths
 */
export function addPathCreatorStep(
	generatedTemplates: {
		argoTaskTemplate: ArgoTaskTemplate;
		argoContainerTemplate: ArgoContainerTemplate;
	}[],
) {
	const stepName = 'path-creator';

	const _pathsToCreate: String[] = [];
	for (let { argoTaskTemplate: argoDagTemplate } of generatedTemplates) {
		let params = argoDagTemplate.arguments?.parameters;
		if (params != undefined) {
			for (let param of params) {
				if (param?.type === ArgoTaskParameterType.OutputPath) {
					_pathsToCreate.push(param.value);
					if (!argoDagTemplate.dependencies) {
						argoDagTemplate.dependencies = [];
					}
					argoDagTemplate.dependencies.push(stepName);
				}
			}
		}
	}

	const pathsToCreate = _pathsToCreate.join(',');
	const pathCreatorTask = pathCreatorTaskTemplate(stepName, pathsToCreate);
	const pathCreatorContainer = pathCreatorContainerTemplate();

	generatedTemplates.push({
		argoTaskTemplate: pathCreatorTask,
		argoContainerTemplate: pathCreatorContainer,
	});
}
