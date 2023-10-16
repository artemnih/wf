import {stepsFromWorkflow} from './mergeStepInfo';
import {cwlJobInput, parseCwlJobInputs} from './parseCwlJobInputs';
import {
  ArgoWorklowTemplate,
  ArgoDagTaskTemplate,
  Step,
  CwlWorkflow,
  ArgoContainerTemplate,
  ArgoDagTasks,
  ComputeJob,
} from '../../types';
import {determineDependencies} from './determineDependencies';
import {BoundOutput, boundStepOutputToStepInputValue} from './boundOutputToInputs';
import {addOperatorPlugin} from './addOperatorPlugins';
import path from 'path'

/**
 * Argo Workflow Template expanded with some defaults value
 * Define volume mounts
 * TODO CHECK labels: {'workflows.argoproj.io/archive-strategy': 'false'}
 * could be to keep or remove intermediary datasets.
 */
function defaultArgoWorkflowTemplate(): ArgoWorklowTemplate {
  require('dotenv').config();
  const argoConfig = require('config');

  return {
    namespace: 'argo',
    serverDryRun: false,
    workflow: {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Workflow',
      metadata: {
        name: 'hello-world-parameters-',
        namespace: 'argo',
        labels: {
          'workflows.argoproj.io/archive-strategy': 'false',
        },
      },
      spec: {
        volumes: [
          {
            name: argoConfig.argoCompute.volumeDefinitions.name,
            persistentVolumeClaim: {
              claimName: argoConfig.argoCompute.volumeDefinitions.pvcName,
            },
          },
        ],
        entrypoint: 'workflow',
        templates: [
          {
            name: 'workflow',
            dag: {
              tasks: [
                {
                  name: 'busybox',
                  template: 'busybox',
                },
              ],
            },
            inputs: {parameters: [{}]},
          },
          {
            name: 'busybox',
            inputs: {parameters: [{}]},
            container: {
              image: 'busybox',
              args: [],
              command: [],
              volumeMounts: [],
            },
          },
        ],
      },
    },
  };
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
 * 
 * @param cwlWorkflow : the full original cwl workflow at the exception of cwlJobInputs
 * @param cwlJobInputs : those are the input values for each steps coming from cwlJobInputs
 * @param computeJobs : compute view of a command line tool alongs its input/output values
 * @returns an argo workflow
 */
export function cwlToArgo(
  cwlWorkflow: CwlWorkflow,
  cwlJobInputs: object,
  computeJobs: ComputeJob[],
): ArgoWorklowTemplate {

  // create a new argo workflow from a base template
  const argoWorkflow = {...defaultArgoWorkflowTemplate().workflow};
  const steps : Step[] = stepsFromWorkflow(cwlWorkflow, computeJobs);
  //TODO there is a notion of scatter value so check what this is.
  //seems to be a custom attribute to generate several templates
  // when a list is used for a single valued attribute.
  // TODO refactor later
  const operatorReturn = addOperatorPlugin(cwlWorkflow, steps, computeJobs);
  //TODO check this logic later
  argoWorkflow.metadata.name = `${operatorReturn.jobs[0].workflowId}`;
  //TOOD remove. Already part of the template
  // argoWorkflow.spec.entrypoint = 'workflow';
  
  // collect info to build each argo template
  const boundOutputs = boundStepOutputToStepInputValue(operatorReturn.steps);
  const workflowInputs = parseCwlJobInputs(cwlJobInputs);

  // build each individual argo step
  const generatedTemplates = operatorReturn.steps.map(
    (step) => {
      return buildStepTemplates(step, workflowInputs, boundOutputs);
    },
  );

  const dagArray: ArgoDagTasks = {
    name: 'workflow',
    dag: {tasks: []},
  }; 
  
  // multiple tasks can be using the same container definition.
  // Let's only store the unique ones in the template.
  const containerNames = new Set();

  generatedTemplates.forEach((templates, index) => {
    dagArray.dag.tasks.push(templates.argoDagTemplate);
    if (!containerNames.has(`${templates.argoContainerTemplate.name}`)) {
      argoWorkflow.spec.templates[index + 1] = templates.argoContainerTemplate;
      containerNames.add(`${templates.argoContainerTemplate.name}`);
    }
  });
  argoWorkflow.spec.templates[0] = dagArray;
  

  return {
    namespace: 'argo',
    serverDryRun: false,
    workflow: {...argoWorkflow},
  };
}

/**
 * Build a single argo step by identifying inputs and outputs
 * @param step 
 * @param step_order 
 * @param cwlJobInputs 
 * @param boundOutputs 
 * @returns a dictionary containing a argDagTemplate and a argoContainerTemplate
 */
export function buildStepTemplates(
  step: Step,
  cwlJobInputs: cwlJobInput[],
  boundOutputs: BoundOutput[]
): 
{
  argoDagTemplate: ArgoDagTaskTemplate;
  argoContainerTemplate: ArgoContainerTemplate;
} 
{
  console.log("------- working on : ", step.name)
  
  const argoContainerTemplate = buildArgoContainerTemplate(step)
  const argoDagTemplate = buildArgoDagTaskTemplate(step, cwlJobInputs, boundOutputs)

  return { argoDagTemplate, argoContainerTemplate };
}

function buildArgoDagTaskTemplate(
  step: Step, 
  cwlJobInputs: cwlJobInput[],
  boundOutputs: BoundOutput[]) {
  require('dotenv').config();
  const argoConfig = require('config');

  let scatterParam: string[] | string = '';
  const taskArgumentsParameters: object[] = [];
  const templateName = step.name

  // step names this step depends on
  const dependencies = determineDependencies(step);

  for (const stepInput in step.in) {

    let inputValue : string | string[] = null
    
     //for each input step, check if it is defined in the cwlJobInputs
    const workflowInput = cwlJobInputs.find(
      (element) => step.in[stepInput] === element.name,
    );
    if (workflowInput) {
      inputValue = workflowInput.value;

      //TODO CHECK THIS LATER
      if (step.scatter === stepInput) {
        inputValue = '{{item}}';
        scatterParam = workflowInput?.value as string[];
      } else {
        warnAboutStringArrayParameters(inputValue);
      }

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

  const argoDagTemplate: ArgoDagTaskTemplate = {
    name: `${step.clt.id}`,
    template: `${step.clt.id}`,
    arguments: {
      parameters: taskArgumentsParameters,
    },
  };

  if (step.scatter) {
    if (Array.isArray(scatterParam)) {
      argoDagTemplate.withItems = scatterParam as string[];
    } else {
      argoDagTemplate.withParam = scatterParam as string;
    }
  }

  if (dependencies.length > 0) {
    argoDagTemplate.dependencies = dependencies;
  }
  
  return argoDagTemplate;
}


function buildArgoContainerTemplate(step: Step) {

  console.log(`------- generating container template for step ${step.name}`)

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
  let argname = step.clt.inputs[inputParam].inputBinding.prefix;

  if (argname) {
    // For array inputs, CWL requires a = after the prefix.  For argo, this causes issues.
    // We will remove from the argo workflow builder.
    // TODO CHECK the spec, address and remove original comment above
    argname = argname.replace('=', '');

    // ex : ['--name','{{inputs.parameters.name}}']
    return [`${argname}`, `{{inputs.parameters.${inputParam}}}`];
  } 
  else {
    //TODO AGAIN CHECK SPEC TO SEE IF THIS ACCEPTABLE
    return [`{{inputs.parameters.${inputParam}}}`];
  }
}
