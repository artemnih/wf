import {
  ArgoWorklow,
  ArgoTaskTemplate,
  ArgoContainerTemplate,
  Step,
  CwlWorkflow,
  ComputeJob,
  BoundOutput,
  WorkflowInput,
  CwlJobInputs,
} from '../../types';

import { buildArgoWorkflowTemplate } from './utils/buildArgoWorkflowTemplate';
import { stepsFromWorkflow } from './utils/createSteps';
import { parseCwlJobInputs } from './utils/parseCwlJobInputs';
import { boundOutputsToInputs } from './utils/boundOutputsToInputs';
import { addScatterOperator } from './addScatterOperator';
import { buildArgoContainerTemplate } from './utils/buildArgoContainerTemplate';
import { buildArgoDagTaskTemplate } from './utils/buildArgoTaskTemplate';
import { addPathCreatorStep } from './utils/addPathCreatorStepTemplates';

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
): ArgoWorklow {

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

addPathCreatorStep(generatedTemplates)

  // multiple tasks can be using the same container definition.
  // Let's only keep one container template per workflow
  const tasks : ArgoTaskTemplate[] = []
  const containers = new Array<ArgoContainerTemplate>();
  const containerNames = new Set();
  generatedTemplates.forEach((templates) => {
    tasks.push(templates.argoTaskTemplate)
    if (!containerNames.has(`${templates.argoContainerTemplate.name}`)) {
      containers.push(templates.argoContainerTemplate)
      containerNames.add(`${templates.argoContainerTemplate.name}`);
    }
  });

  //build the final workflow
  const argoWorkflow = buildArgoWorkflowTemplate(
    cwlWorkflow,
    containers,
    tasks,
  )

  return argoWorkflow
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
  argoTaskTemplate: ArgoTaskTemplate;
  argoContainerTemplate: ArgoContainerTemplate;
} 
{
  const argoContainerTemplate = buildArgoContainerTemplate(step)
  const argoTaskTemplate = buildArgoDagTaskTemplate(step, cwlJobInputs, boundOutputs)

  return { argoTaskTemplate: argoTaskTemplate, argoContainerTemplate };
}