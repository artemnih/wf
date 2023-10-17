import {stepsFromWorkflow} from './models/createSteps';
import {CwlJobInput, parseCwlJobInputs} from './models/parseCwlJobInputs';
import {
  ArgoWorklowTemplate,
  ArgoDagTaskTemplate,
  Step,
  CwlWorkflow,
  ArgoContainerTemplate,
  ArgoDagTasks,
  ComputeJob,
} from '../../types';

import {defaultArgoWorkflowTemplate} from './templates/defaultArgoWorkflowTemplate'

import {determineDependencies} from './models/determineDependencies';
import {BoundOutput, boundOutputsToInputs} from './models/boundOutputsToInputs';
import {addScatterOperator} from './addScatterOperator';
import path from 'path'

/**
 * Request the execution of a CWL workflow with Argo.
 * @param cwlWorkflow the original cwlWorkflow
 * @param cwlJobInputs the orginal cwlJobInputs
 * @param computeJobs jobs are the step definitions stored by compute
 * @returns an argo workflow
 */
export function cwlToArgo(
  cwlWorkflow: CwlWorkflow,
  cwlJobInputs: object,
  computeJobs: ComputeJob[],
): ArgoWorklowTemplate {

  // create a new argo workflow from a base template
  const argoWorkflow = {...defaultArgoWorkflowTemplate().workflow};

  argoWorkflow.metadata.name = cwlWorkflow.id;

  let steps : Step[] = stepsFromWorkflow(cwlWorkflow, computeJobs);
  //TODO CHECK SCATTER 
  //there is a notion of scatter value so check what this is.
  //seems to be a custom attribute to generate several templates
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

  //build the dag of tasks
  const dagArray: ArgoDagTasks = {
    name: 'workflow',
    dag: {tasks: []},
  }; 
  // multiple tasks can be using the same container definition.
  // Let's only keep one container template per workflow
  const containerNames = new Set();
  const containers = new Array<ArgoContainerTemplate>();
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
 * Build a single argo step by identifying inputs and outputs
 * @param step the workflow step to build argo definitions for.
 * @param cwlJobInputs the list of inputs defined at the workflow level
 * @param boundOutputs the list of outputs dependent on inputs
 * @returns a tuple of a argDagTemplate and a its associated argoContainerTemplate
 */
export function buildStepTemplates(
  step: Step,
  cwlJobInputs: CwlJobInput[],
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

/**
 * Build the argo dag task template for the given step.
 * @param step a worfklow step
 * @param cwlJobInputs the parsed cwlJobInputs
 * @param boundOutputs the bound outputs
 * @returns the argo dag task template.
 */
function buildArgoDagTaskTemplate(
  step: Step, 
  cwlJobInputs: CwlJobInput[],
  boundOutputs: BoundOutput[]) {

  // step names this step depends on
  const dependencies = determineDependencies(step);

  let { taskArgumentsParameters, scatterParam }  = createTaskParameters(step, cwlJobInputs, boundOutputs)

  const argoDagTemplate: ArgoDagTaskTemplate = {
    name: `${step.clt.id}`,
    template: `${step.clt.id}`,
    arguments: {
      parameters: taskArgumentsParameters,
    },
  };

  //TODO CHECK SCATTER 
  if (step.scatter) {
    if (Array.isArray(scatterParam)) {
      argoDagTemplate.withItems = scatterParam as string[];
    } else if(typeof scatterParam === "string") {
        argoDagTemplate.withParam = scatterParam as string;
    }
  }

  if (dependencies.length > 0) {
    argoDagTemplate.dependencies = dependencies;
  }
  
  return argoDagTemplate;
}

function createTaskParameters(
  step: Step, 
  cwlJobInputs: CwlJobInput[],
  boundOutputs: BoundOutput[]
  ) {

  // get configuration
  require('dotenv').config();
  const argoConfig = require('config');
      
  let scatterParam: string[] | string = '';
  const taskArgumentsParameters: object[] = [];
  const templateName = step.name

  for (const stepInput in step.in) {

    let inputValue : string | string[] = null
    
     //for each input step, check if it is defined in the cwlJobInputs
    const workflowInput = cwlJobInputs.find(
      (element) => step.in[stepInput] === element.name,
    );
    if (workflowInput) {
      inputValue = workflowInput.value;

      //TODO CHECK SCATTER
      if (step.scatter === stepInput) {
        inputValue = '{{item}}';
        scatterParam = workflowInput?.value;
      } else {
        warnAboutStringArrayParameters(inputValue);
      }

      // if have a directory, we have a relative path that we need to mount
      // within the container it will be executed on, in order to store results
      // and potentially make them available to later steps.
      // We thus mount it in a writable location.
      if(step.clt.inputs[stepInput]?.type == 'Directory') {
        const argoMountPath = argoConfig.argoCompute.volumeDefinitions.outputPath
        inputValue = path.join(argoMountPath , step.name, inputValue as string)
      }
      const parameter = {name: `${stepInput}`, value: inputValue}
      taskArgumentsParameters.push(parameter);
    }
    else {
      // CWL special case.  If a input depends on a previous output.
      // The input parameter has the special syntax: previoustep/outputname
      const dependentInput = step.in[stepInput].split('/');
      if (dependentInput.length !== 2) {
        throw Error(
          `Invalid ${stepInput} for step ${templateName}. 
          Should be a dependent input in the form dependentStepName/dependentInputName`,
        );
      }
      let [boundStep, boundOutput] = dependentInput

      const boundInput = boundOutputs.find(
        (element) => boundStep == element.stepName && boundOutput === element.outputName
      );

      if(boundInput) { 
        const workflowInput = cwlJobInputs.find(
          (element) => boundInput.inputName === element.name,
        );
        if(workflowInput){
          inputValue = workflowInput?.value;

          // If we have directory, it means we are depending on data created by a previous step.
          // We need to mount the directory into a read only location coming from the given step.
          if(step.clt.inputs[stepInput]?.type == 'Directory') {
            const argoMountPath = argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath
            inputValue = path.join(argoMountPath , boundStep, inputValue as string)
          }
          const parameter = {name: `${stepInput}`, value: inputValue}
          taskArgumentsParameters.push(parameter);
        }
      }
    }
  }

  return {taskArgumentsParameters, scatterParam}
}

function warnAboutStringArrayParameters(
  value: string | string[] | undefined,
): void {
  if (Array.isArray(value)) {
    console.warn(
      "Argo driver does not handle array parameters in the dag spec.  Please remove square brackets and pass a string list ie 'r,xy'",
    );
  }
}

/**
 * Build the container template for a given step.
 * @param step the workflow step
 * @returns the container template for this step.
 */
function buildArgoContainerTemplate(step: Step) {
  // retrieve configuration
  require('dotenv').config();
  const argoConfig = require('config');

  const containerArgs: string[] = [];
  const parameterNames: object[] = [];
  const templateName = step.name

  for (const stepInput in step.in) {
    parameterNames.push({name: stepInput});
    const containerArg = buildContainerArg(stepInput, step);
    containerArgs.push(...containerArg);
  }

  const argoContainerTemplate: ArgoContainerTemplate = {
    name: templateName,
    inputs: {
      parameters: parameterNames,
    },
    container: {
      image:
        step.clt.requirements.DockerRequirement.dockerPull,
      command:
        step.clt.baseCommand[0] === ''
          ? []
          : step.clt.baseCommand,
      args: containerArgs,
      volumeMounts: [
        {
          name: argoConfig.argoCompute.volumeDefinitions.name,
          readOnly: true,
          mountPath: argoConfig.argoCompute.volumeDefinitions.mountPath,
        },
        {
          name: argoConfig.argoCompute.volumeDefinitions.name,
          mountPath: `${argoConfig.argoCompute.volumeDefinitions.outputPath}/${step.name}`,
          subPath: `${argoConfig.argoCompute.volumeDefinitions.subPath}/${step.name}`,
          readOnly: false,
        },
      ],
    },
  };

  return argoContainerTemplate
}

/**
 * 
 * @param inputParam 
 * @param step 
 * @returns 
 */
function buildContainerArg(
  inputParam: string,
  step: Step,
): string[] {

  // check if the step input is also defined in the clt definition
  if (!step.clt.inputs[inputParam]) {
    throw Error(
      `The value ${inputParam} was not found in ${step.clt.inputs}`,
    );
  }

  //extract container argument name from the clt definition
  let argName = step.clt.inputs[inputParam].inputBinding.prefix;
  let argValue = `{{inputs.parameters.${inputParam}}}`

  if (argName) {
    // For array inputs, CWL requires a = after the prefix.
    // This is invalid in Argo so we remove it.
    // TODO CHECK the spec
    // Address and remove original comment above
    // for example, if it is trailing, just use substring instead.
    argName = argName.replace('=', '');

    // ex : ['--name','{{inputs.parameters.name}}']
    return [argName, argValue];
  } 
  else {
    //TODO CHECK the spec 
    // to see if this is handled properly
    // we have a flag, just pass the value through
    return [argValue];
  }
}
