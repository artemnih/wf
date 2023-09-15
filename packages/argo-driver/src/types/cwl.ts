export interface CwlScript {
  cwlVersion: string;
  id: string;
  class: string;
  requirements: {DockerRequirement: {dockerPull: string}};
  baseCommand: string[];
  inputs: Record<string, CwlScriptInput>;
  outputs: Record<string, CwlScriptOutput>;
}

export interface CwlWorkflowStep {
  run: string;
  in: Record<string, string>;
  out: string[];
  scatter?: string;
  when?: string;
}

export interface CwlScriptInAndOut {
  cwlScript: CwlScript;
  in: Record<string, string>;
  out: string[];
  scatter?: string;
  when?: string;
}

export interface CwlWorkflow {
  cwlVersion: string;
  class: string;
  id: string;
  inputs: object;
  outputs: Record<string, CwlOutput>;
  steps: Record<string, CwlWorkflowStep>;
}

export interface CwlOutput {
  type: string;
  outputSource: string | string[];
}

export interface CwlScriptOutput {
  type: string;
  outputBinding: {
    glob: string;
  };
}

export interface CwlScriptInput {
  type: string;
  inputBinding: {
    position?: number;
    prefix?: string;
  };
}
