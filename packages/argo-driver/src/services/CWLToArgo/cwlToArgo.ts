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
    (step, step_order) => {
      return buildStepTemplates(step, step_order, workflowInputs, boundOutputs);
    },
  );

  const dagArray: ArgoDagTasks = {
    name: 'workflow',
    dag: {tasks: []},
  }; 
  const containerArray: ArgoContainerTemplate[] = [];

  generatedTemplates.forEach((value) => {
    dagArray.dag.tasks.push(value.argoDagTemplate);
    containerArray.push(value.argoContainerTemplate);
  });
  // You can have multiple containers in a workflow.
  // Let's only store the unique ones in the template.
  argoWorkflow.spec.templates[0] = dagArray;
  const containerSet = new Set();
  containerArray.forEach((value, index) => {
    if (!containerSet.has(`${value.name}`)) {
      argoWorkflow.spec.templates[index + 1] = value;
    }
    containerSet.add(`${value.name}`);
  });
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
  step_order: number,
  cwlJobInputs: cwlJobInput[],
  boundOutputs: BoundOutput[],
): 
{
  argoDagTemplate: ArgoDagTaskTemplate;
  argoContainerTemplate: ArgoContainerTemplate;
} 
{

  console.log("------- working on : ", step.name)
  
  buildArgoContainerTemplate(step)

  require('dotenv').config();
  const argoConfig = require('config');

  let scatterParam: string[] | string = '';
  const taskArgumentsParameters: object[] = [];
  const templateName = step.name

  // step names this step depends on
  const dependencies = determineDependencies(step);

  for (const stepInput in step.in) {
    
    const workflowInput = cwlJobInputs.find(
      (element) => step.in[stepInput] === element.name,
    );

    //for each input step, check if it is defined in the cwlJobInputs
    if (workflowInput) {
      let value = workflowInput?.value;

      //TODO CHECK THIS LATER
      if (step.scatter === stepInput) {
        value = '{{item}}';
        scatterParam = workflowInput?.value as string[];
      } else {
        warnAboutStringArrayParameters(value);
      }

      const parameter = {name: `${stepInput}`, value: value}

      taskArgumentsParameters.push(parameter);
    }

    // CWL special case.  If a input depends on a previous output.
    // The input parameter has the special syntax: previoustep/outputname
    else {
      const outputValue = step.in[stepInput].split('/');
      if (outputValue.length !== 2) {
        throw Error(
          `Invalid ${stepInput} for step ${templateName}. 
          Should be a dependent input in the form dependentStepName/dependentInputName`,
        );
      }

      // TODO HACK CHANGE - this fix will only works with wic as we rely on its 
      // representation for name (triple underscores)
      // A better approach would be to pass former steps and look for the value of the 
      // param there. We assume some ordering where dependent step are defined after 
      // the step they depend on.
      const cwlDependentParameter = outputValue[0] + "___" + outputValue[1]

      const searchedOutput = boundOutputs.find(
        (element) => cwlDependentParameter === element.inputName,
      );

      // If a scatter is dynamic then it is generated
      // We can assume that it wasn't defined as an input and outValue has two entries
      // Then let's set our scatterParam to be dynamically generated via argo.
      if (!workflowInput && step.scatter === stepInput) {
        scatterParam = `{{tasks.${outputValue[0]}.outputs.result}}`;
        taskArgumentsParameters.push({name: `${stepInput}`, value: '{{item}}'});
      }

      if (searchedOutput) {
        const outputSearch = cwlJobInputs.find(
          (element) => searchedOutput.inputName === element.name,
        );
        if (outputSearch && typeof outputSearch.value === 'string') {
          // const outputName = outputSearch.value

          const workflowParam = cwlJobInputs.find(
            (element) => cwlDependentParameter === element.name
          )

          const [parentStep, param] = outputSearch.value.split('/')

          if(workflowParam){
            let path : string = workflowParam.value as string;
            path = path.split("/").slice(3).join("/")
            path = "/data/inputs/temp/jobs/" + path
            const entry = {name: `${stepInput}`, value: path}
            console.log("------- defining entry : ", entry)
            taskArgumentsParameters.push(entry);
            continue
          }

          const [outputName] = outputSearch.value.split('/').slice(-1);
          const entry = {
            name: `${stepInput}`,
            value: `${argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath}/${outputName}`,
          }

          console.log("------- defining entry : ", entry)

          taskArgumentsParameters.push(entry);
        }
      }
    }
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
            mountPath: `${argoConfig.argoCompute.volumeDefinitions.outputPath}/${step.clt.id}`,
            subPath: `${argoConfig.argoCompute.volumeDefinitions.subPath}/${step.clt.id}`,
            readOnly: false,
          },
        ],
      },
    };

    return argoContainerTemplate
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
  
  return {argoDagTemplate, argoContainerTemplate};
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
