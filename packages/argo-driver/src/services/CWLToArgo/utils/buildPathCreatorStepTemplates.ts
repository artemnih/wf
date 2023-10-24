import { pathCreatorTaskTemplate } from '../../../operators/pathCreator/templates/pathCreatorTaskTemplate';
import { pathCreatorContainerTemplate } from '../../../operators/pathCreator/templates/pathCreatorContainerTemplate';

import {
    ArgoDagTaskTemplate,
    ArgoContainerTemplate,
    ArgoTaskParameterType
  } from '../../../types';

/**
 * Build task and container templates for the path creator.
 * @param generatedTemplates the list of steps that may need output paths
 * @returns a tuple containing the task and container templates.
 */
export function buildPathCreatorStepTemplates(
    generatedTemplates : {
        argoDagTemplate: ArgoDagTaskTemplate;
        argoContainerTemplate: ArgoContainerTemplate;
    }[]) {

    let _pathsToCreate : String[] = []
    for (let template of generatedTemplates) {
        let params = template.argoDagTemplate.arguments?.parameters
        if (params != undefined){
            for(let param of params) {
                if(param?.type === ArgoTaskParameterType.OutputPath) {
                    _pathsToCreate.push(param.value)
                }
            }
      }
    }
    
    let pathsToCreate = _pathsToCreate.join(',');
  
    let pathCreatorTask = pathCreatorTaskTemplate(pathsToCreate)
    let pathCreatorContainer = pathCreatorContainerTemplate()
  
    for (let {argoDagTemplate, } of generatedTemplates) {
      if(!argoDagTemplate.dependencies) {
        argoDagTemplate.dependencies = []
      }
      argoDagTemplate.dependencies.push(pathCreatorTask.name)
    }

    return { pathCreatorTask, pathCreatorContainer }
}