import {scriptsFromWorkflow} from './cwlScriptToArray';
import {JobParameters, parseJobParameters} from './parseJobParameters';
import {
  ArgoWorklowTemplate,
  ArgoDagTaskTemplate,
  CwlScriptInAndOut,
  CwlWorkflow,
  ArgoContainerTemplate,
  ArgoDagArray,
  MinimalJob,
} from '../../types';
import {determineDependencies} from './determineDependencies';
import {MappedOutput, mapOutputToInputs} from './mapOutputToInputs';
import {addOperatorPlugin} from './addOperatorPlugins';
function defaultArgoWorkflowTemplate(): ArgoWorklowTemplate {
  require('dotenv').config();
  const argoConfig = require('config');

  return {
    namespace: 'default',
    serverDryRun: false,
    workflow: {
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Workflow',
      metadata: {
        name: 'hello-world-parameters-',
        namespace: 'default',
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
export function cwlToArgo(
  cwlWorkflow: CwlWorkflow,
  cwlJobParams: object,
  jobConst: MinimalJob[],
): ArgoWorklowTemplate {
  const argoWorkflow = {...defaultArgoWorkflowTemplate().workflow};
  const scripts = scriptsFromWorkflow(cwlWorkflow, jobConst);
  const operatorReturn = addOperatorPlugin(cwlWorkflow, scripts, jobConst);
  const mappedOutputs = mapOutputToInputs(operatorReturn.cwlScriptInAndOut);
  const jobParams = parseJobParameters(cwlJobParams);

  argoWorkflow.metadata.name = `${operatorReturn.jobs[0].workflowId}`;
  argoWorkflow.spec.entrypoint = 'workflow';

  const generatedTemplates = operatorReturn.cwlScriptInAndOut.map(
    (value, index) => {
      return buildContainerTemplate(value, index, jobParams, mappedOutputs);
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
  // You can have multiple containers in a workflow.  Let's only store the unique ones in the template.
  argoWorkflow.spec.templates[0] = dagArray;
  const containerSet = new Set();
  containerArray.forEach((value, index) => {
    if (!containerSet.has(`${value.name}`)) {
      argoWorkflow.spec.templates[index + 1] = value;
    }
    containerSet.add(`${value.name}`);
  });
  return {
    namespace: 'default',
    serverDryRun: false,
    workflow: {...argoWorkflow},
  };
}

export function buildContainerTemplate(
  cwlScriptInAndOut: CwlScriptInAndOut,
  index: number,
  jobParameters: JobParameters[],
  detailedOutput: MappedOutput[],
): {
  argoDagTemplate: ArgoDagTaskTemplate;
  argoContainerTemplate: ArgoContainerTemplate;
} {
  require('dotenv').config();
  const argoConfig = require('config');

  const containerArgs: string[] = [];
  const inputParameter: object[] = [];
  let scatterParam: string[] | string = '';
  const jobPerTask: object[] = [];
  const dependencies = determineDependencies(cwlScriptInAndOut.in);
  for (const property in cwlScriptInAndOut.in) {
    inputParameter.push({name: property});
    containerArgs.push(...containerArguments(property, cwlScriptInAndOut));
    const jobParam = jobParameters.find(
      (element) => cwlScriptInAndOut.in[property] === element.name,
    );
    // If input is defined in the JobParameters field
    // You can use that object to populate array.
    if (jobParam) {
      let value = jobParam?.value;
      if (cwlScriptInAndOut.scatter === property) {
        value = '{{item}}';
        scatterParam = jobParam?.value as string[];
      } else {
        warnAboutStringArrayParameters(value);
      }

      jobPerTask.push({name: `${property}`, value: value});
    }

    // CWL special case.  If a input depends on a previous output.
    // The input parameter has the special syntax: previoustep/outputname
    const outputValue = cwlScriptInAndOut.in[property].split('/');
    if (outputValue.length === 2) {
      const searchedOutput = detailedOutput.find(
        (element) => outputValue[1] === element.outputName,
      );
      // If a scatter is dynamic then it is generated
      // We can assume that it wasn't defined as an input and outValue has two entries
      // Then let's set our scatterParam to be dynamically generated via argo.
      if (!jobParam && cwlScriptInAndOut.scatter === property) {
        scatterParam = `{{tasks.${outputValue[0]}.outputs.result}}`;
        jobPerTask.push({name: `${property}`, value: '{{item}}'});
      }

      if (searchedOutput) {
        const outputSearch = jobParameters.find(
          (element) => searchedOutput.inputName === element.name,
        );
        if (outputSearch && typeof outputSearch.value === 'string') {
          const [outputName] = outputSearch.value.split('/').slice(-1);
          jobPerTask.push({
            name: `${property}`,
            value: `${argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath}/${outputName}`,
          });
        }
      }
    }
  }
  const argoContainerTemplate: ArgoContainerTemplate = {
    name: `${cwlScriptInAndOut.cwlScript.id}`,
    inputs: {
      parameters: inputParameter,
    },
    container: {
      image:
        cwlScriptInAndOut.cwlScript.requirements.DockerRequirement.dockerPull,
      command:
        cwlScriptInAndOut.cwlScript.baseCommand[0] === ''
          ? []
          : cwlScriptInAndOut.cwlScript.baseCommand,
      args: containerArgs,
      volumeMounts: [
        {
          name: argoConfig.argoCompute.volumeDefinitions.name,
          readOnly: true,
          mountPath: argoConfig.argoCompute.volumeDefinitions.mountPath,
        },
        {
          name: argoConfig.argoCompute.volumeDefinitions.name,
          mountPath: `${argoConfig.argoCompute.volumeDefinitions.outputPath}/${cwlScriptInAndOut.cwlScript.id}`,
          subPath: `${argoConfig.argoCompute.volumeDefinitions.subPath}/${cwlScriptInAndOut.cwlScript.id}`,
          readOnly: false,
        },
      ],
    },
  };
  const argoDagTemplate: ArgoDagTaskTemplate = {
    name: `${cwlScriptInAndOut.cwlScript.id}`,
    template: `${cwlScriptInAndOut.cwlScript.id}`,
    arguments: {
      parameters: jobPerTask,
    },
  };
  if (cwlScriptInAndOut.scatter) {
    if (Array.isArray(scatterParam)) {
      argoDagTemplate.withItems = scatterParam as string[];
    } else {
      argoDagTemplate.withParam = scatterParam as string;
    }
  }
  if (dependencies.length > 0) argoDagTemplate.dependencies = dependencies;
  return {argoDagTemplate, argoContainerTemplate};
}
function containerArguments(
  property: string,
  cwlScriptInAndOut: CwlScriptInAndOut,
): string[] {
  if (!cwlScriptInAndOut.cwlScript.inputs[property]) {
    throw Error(
      `The value ${property} was not found in ${cwlScriptInAndOut.cwlScript.inputs}`,
    );
  }
  const prefix =
    cwlScriptInAndOut.cwlScript.inputs[property].inputBinding.prefix;
  if (prefix) {
    // For array inputs, CWL requires a = after the prefix.  For argo, this causes issues.
    // We will remove from the argo workflow builder.
    const removeEqualsPrefix = prefix.replace('=', '');
    return [`${removeEqualsPrefix}`, `{{inputs.parameters.${property}}}`];
  } else {
    return [`{{inputs.parameters.${property}}}`];
  }
}
