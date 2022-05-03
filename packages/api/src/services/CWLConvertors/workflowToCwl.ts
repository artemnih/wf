import { Workflow } from '../../models';
export interface StepTemplate {
  run: string;
  in: object;
  out: string[];
}
export interface CwlWorkflowTemplate {
  cwlVersion: string;
  class: string;
  requirements: object;
  id: string;
  inputs: object;
  outputs: object;
  steps: Record<string, StepTemplate>;
}

function commandLineTemplate(): CwlWorkflowTemplate {
  return {
    cwlVersion: 'v1.2',
    class: 'Workflow',
    id: 'name',
    requirements: { ScatterFeatureRequirement: {}, InlineJavascriptRequirement: {} },
    inputs: {},
    outputs: {},
    steps: {},
  };
}

export function workflowToCwl(workflow: Workflow): CwlWorkflowTemplate {
  const cwlWorkflow = commandLineTemplate();
  cwlWorkflow.id = workflow.id ? workflow.id : workflow.name;
  cwlWorkflow.inputs = workflow.inputs;
  cwlWorkflow.outputs = workflow.outputs;
  cwlWorkflow.steps = workflow.steps as Record<string, StepTemplate>;
  return cwlWorkflow;
}
export function cwlJobInputs(workflow: Workflow): object {
  return workflow.cwlJobInputs;
}
