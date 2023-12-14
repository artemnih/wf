export interface WorkflowExecutionRequest {
  id?: number;
  cwlWorkflow: CwlWorkflow;
  cwlJobInputs: CwlJobInputs;
  jobs: ComputeJob[];
}

export type CwlJobInputs = Record<string, string | Record<string, string>>


export interface ComputeJob {
  id?: string;
  driver?: string;
  workflowId: string;
  commandLineTool?: CLT;
  inputs: object;
  outputs: object;
  stepName: string;
  status?: string;
  dateCreated?: string;
  dateFinished?: string;
}

export interface CLT {
  cwlVersion: string;
  id: string;
  class: string;
  requirements: {DockerRequirement: {dockerPull: string}};
  baseCommand: string[];
  inputs: Record<string, CLTInput>;
  outputs: Record<string, CLTOutput>;
}

export interface CwlWorkflow {
  cwlVersion: string;
  class: string;
  id: string;
  inputs: Record<string,CwlWorkflowInput>;
  outputs: Record<string, CwlWorkflowOutput>;
  steps: Record<string, CwlWorkflowStep>;
}

export interface CwlWorkflowStep {
  run: string;
  in: Record<string, string | Record<string, string>>;
  out: string[];
  scatter?: string;
  when?: string;
}

export interface CwlWorkflowOutput {
  type: string;
  outputSource: string | string[];
}

export interface CwlWorkflowInput {
  type: string;
}

export interface CLTOutput {
  type: string;
  outputBinding: {
    glob: string;
  };
}

export interface CLTInput {
  type: string;
  inputBinding: {
    position?: number;
    prefix?: string;
  };
}