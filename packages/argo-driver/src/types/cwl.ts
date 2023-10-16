export interface CLT {
  cwlVersion: string;
  id: string;
  class: string;
  requirements: {DockerRequirement: {dockerPull: string}};
  baseCommand: string[];
  inputs: Record<string, CLTInput>;
  outputs: Record<string, CLTOutput>;
}


/*
TODO Should be removed and only Step should be use.
*/
export interface CwlWorkflowStep {
  run: string;
  in: Record<string, string>;
  out: string[];
  scatter?: string;
  when?: string;
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
  // TODO logically should CwlInput?
  inputs: object;
  outputs: Record<string, CwlStepOutput>;
  steps: Record<string, CwlWorkflowStep>;
}

export interface CwlStepOutput {
  type: string;
  outputSource: string | string[];
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
