export interface WorkflowExecutionRequest {
  id?: number;
  cwlWorkflow: CwlWorkflow;
  cwlJobInputs: object;
  jobs: ComputeJob[];
}

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
export interface Step {
  clt: CLT;
  name: string;
  in: Record<string, string>;
  out: string[];
  scatter?: string;
  when?: string;
}

export interface CwlWorkflow {
  cwlVersion: string;
  class: string;
  id: string;
  inputs: Record<string,CwlStepInput>;
  outputs: Record<string, CwlStepOutput>;
  steps: Record<string, CwlWorkflowStep>;
}


export interface CwlWorkflowStep {
  run: string;
  in: Record<string, string>;
  out: string[];
  scatter?: string;
  when?: string;
}

export interface CwlStepOutput {
  type: string;
  outputSource: string | string[];
}

export interface CwlStepInput {
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
