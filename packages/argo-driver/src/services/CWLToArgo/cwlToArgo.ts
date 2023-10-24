import {
  ArgoWorklowTemplate,
  ArgoDagTaskTemplate,
  Step,
  CwlWorkflow,
  ArgoContainerTemplate,
  ArgoDagTasks,
  ComputeJob,
  BoundOutput,
  WorkflowInput,
  CwlJobInputs,
  ArgoTaskParameterType
} from '../../types';

import { pathCreatorTaskTemplate } from '../../operators/pathCreator/templates/pathCreatorTaskTemplate';
import { pathCreatorContainerTemplate } from '../../operators/pathCreator/templates/pathCreatorContainerTemplate';

import {defaultArgoWorkflowTemplate} from './templates/defaultArgoWorkflowTemplate';
import {stepsFromWorkflow} from './utils/createSteps';
import { parseCwlJobInputs} from './utils/parseCwlJobInputs';
import {boundOutputsToInputs} from './utils/boundOutputsToInputs';
import {addScatterOperator} from './addScatterOperator';
import { buildArgoContainerTemplate } from './utils/buildArgoContainerTemplate';
import { buildArgoDagTaskTemplate } from './utils/buildArgoDagTaskTemplate';

/**
 * Request the execution of a CWL workflow with Argo.
 * @param cwlWorkflow the original cwlWorkflow
 * @param cwlJobInputs the orginal cwlJobInputs
 * @param computeJobs jobs are the step definitions stored by compute
 * @returns an argo workflow
 */
export function cwlToArgo(
  cwlWorkflow: CwlWorkflow,
  cwlJobInputs: CwlJobInputs,
  computeJobs: ComputeJob[],
): ArgoWorklowTemplate {

  // create a new argo workflow from a base template
  const argoWorkflow = {...defaultArgoWorkflowTemplate().workflow};

  argoWorkflow.metadata.name = cwlWorkflow.id;

  let steps : Step[] = stepsFromWorkflow(cwlWorkflow, computeJobs);

  // TODO CHECK SCATTER 
  // Seems to be a custom attribute to generate several templates
  // when a list is used for a single valued attribute.
  [cwlWorkflow, steps, computeJobs] = addScatterOperator(cwlWorkflow, steps, computeJobs);
  
  // collect info to build each argo template
  const boundOutputs = boundOutputsToInputs(steps);
  const workflowInputs = parseCwlJobInputs(cwlJobInputs);

  // build each individual argo step
  const generatedTemplates = steps.map(
    (step) => {
      return buildStepTemplates(step, workflowInputs, boundOutputs);
    },
  );

  let _pathsToCreate : String[] = []
  for (let template of generatedTemplates) {
    let params = template.argoDagTemplate.arguments?.parameters
    if (params != undefined){
      for(let param of params) {
            if(param.type === ArgoTaskParameterType.OutputPath) {
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

  //build the dag of tasks
  const dagArray: ArgoDagTasks = {
    name: 'workflow',
    dag: {tasks: [pathCreatorTask]},
  }; 

  // multiple tasks can be using the same container definition.
  // Let's only keep one container template per workflow
  const containerNames = new Set([pathCreatorContainer.name]);
  const containers = new Array<ArgoContainerTemplate>();
  containers.push(pathCreatorContainer)
  generatedTemplates.forEach((templates) => {
    dagArray.dag.tasks.push(templates.argoDagTemplate);
    if (!containerNames.has(`${templates.argoContainerTemplate.name}`)) {
      containers.push(templates.argoContainerTemplate)
      containerNames.add(`${templates.argoContainerTemplate.name}`);
    }
  });

  //update argo workflow template     
  argoWorkflow.spec.templates[0] = dagArray;
  containers.forEach((containerTemplate, index) => {
    argoWorkflow.spec.templates[index + 1] = containerTemplate
  })
  
  return {
    namespace: 'argo',
    serverDryRun: false,
    workflow: {...argoWorkflow},
  };
}

/**
 * Build a single argo step.
 * @param step the workflow step to build argo definitions for.
 * @param cwlJobInputs the list of inputs defined at the workflow level
 * @param boundOutputs the list of outputs dependent on inputs
 * @returns a tuple of a argDagTemplate and its associated argoContainerTemplate
 */
export function buildStepTemplates(
  step: Step,
  cwlJobInputs: WorkflowInput[],
  boundOutputs: BoundOutput[]
): 
{
  argoDagTemplate: ArgoDagTaskTemplate;
  argoContainerTemplate: ArgoContainerTemplate;
} 
{
  const argoContainerTemplate = buildArgoContainerTemplate(step)
  const argoDagTemplate = buildArgoDagTaskTemplate(step, cwlJobInputs, boundOutputs)

  return { argoDagTemplate, argoContainerTemplate };
}

