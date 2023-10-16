import {stepsFromWorkflow as stepsFromWorkflow} from './mergeStepInfo';
import {cwlJobInput, parseCwlJobInputs as parseCwlJobInputs} from './parseCwlJobInputs';
import {
  ArgoWorklowTemplate,
  ArgoDagTaskTemplate,
  Step,
  CwlWorkflow,
  ArgoContainerTemplate,
  ArgoDagArray,
  ComputeJob,
} from '../../types';
import {determineDependencies} from './determineDependencies';
import {MappedOutput, mapStepOutputToStepInputValue as boundStepOutputToStepInputValue} from './mapOutputToInputs';
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
  const steps = stepsFromWorkflow(cwlWorkflow, computeJobs);
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
      return buildContainerTemplate(step, step_order, workflowInputs, boundOutputs);
    },
  );

  const dagArray: ArgoDagArray = {
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
export function buildContainerTemplate(
  step: Step,
  step_order: number,
  cwlJobInputs: cwlJobInput[],
  boundOutputs: MappedOutput[],
): 
{
  argoDagTemplate: ArgoDagTaskTemplate;
  argoContainerTemplate: ArgoContainerTemplate;
} 
{
  require('dotenv').config();
  const argoConfig = require('config');

  //TODO CHECK this used to be generate by the compute API but not anymore
  const stepName = step.clt.id

  console.log("------- working on : ", stepName)

  const containerArgs: string[] = [];
  const inputParameter: object[] = [];
  let scatterParam: string[] | string = '';
  const jobPerTask: object[] = [];

  // is this step depending on the result of other steps?
  const dependencies = determineDependencies(step);

  for (const property in step.in) {

    console.log("------- defining property : ", property)

    inputParameter.push({name: property});

    // find the bindings for the container
    const _container_args = containerArguments(property, step);
    // console.log("------- defining container_args : ", ..._container_args);
    containerArgs.push(..._container_args);

    //for each input step, check if it is defined in the cwlJobInputs
    const jobParam = cwlJobInputs.find(
      (element) => step.in[property] === element.name,
    );

    console.log("------- defining jobparam : ", jobParam)

    // If input is defined in the JobParameters (CWLInputsJobs) field
    if (jobParam) {
      let value = jobParam?.value;
      if (step.scatter === property) {
        value = '{{item}}';
        scatterParam = jobParam?.value as string[];
      } else {
        warnAboutStringArrayParameters(value);
      }
      const entry = {name: `${property}`, value: value}

      console.log("------- defining entry : ", entry)

      jobPerTask.push(entry);
    }

    // CWL special case.  If a input depends on a previous output.
    // The input parameter has the special syntax: previoustep/outputname
    else {
      const outputValue = step.in[property].split('/');
      if (outputValue.length !== 2) {
        throw Error(
          `Invalid ${property} for step ${stepName}. Should be a dependent input in the form dependentStepName/dependentInputName`,
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
      if (!jobParam && step.scatter === property) {
        scatterParam = `{{tasks.${outputValue[0]}.outputs.result}}`;
        jobPerTask.push({name: `${property}`, value: '{{item}}'});
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
            const entry = {name: `${property}`, value: path}
            console.log("------- defining entry : ", entry)
            jobPerTask.push(entry);
            continue
          }

          const [outputName] = outputSearch.value.split('/').slice(-1);
          const entry = {
            name: `${property}`,
            value: `${argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath}/${outputName}`,
          }

          console.log("------- defining entry : ", entry)

          jobPerTask.push(entry);
        }
      }
    }
  }

  const argoContainerTemplate: ArgoContainerTemplate = {
    name: `${step.clt.id}`,
    inputs: {
      parameters: inputParameter,
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

  const argoDagTemplate: ArgoDagTaskTemplate = {
    name: `${step.clt.id}`,
    template: `${step.clt.id}`,
    arguments: {
      parameters: jobPerTask,
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
function containerArguments(
  property: string,
  cwlScriptInAndOut: Step,
): string[] {
  if (!cwlScriptInAndOut.clt.inputs[property]) {
    throw Error(
      `The value ${property} was not found in ${cwlScriptInAndOut.clt.inputs}`,
    );
  }
  const prefix =
    cwlScriptInAndOut.clt.inputs[property].inputBinding.prefix;
  if (prefix) {
    // For array inputs, CWL requires a = after the prefix.  For argo, this causes issues.
    // We will remove from the argo workflow builder.
    const removeEqualsPrefix = prefix.replace('=', '');
    return [`${removeEqualsPrefix}`, `{{inputs.parameters.${property}}}`];
  } else {
    return [`{{inputs.parameters.${property}}}`];
  }
}
