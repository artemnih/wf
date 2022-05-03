import { Pipeline, Workflow } from '../models';
import { PipelineRepository } from '../repositories';

export function workflowToPipeline(workflow: Workflow, name: string, version: string): Pipeline {
  return new Pipeline({
    inputs: workflow.inputs,
    outputs: workflow.outputs,
    steps: workflow.steps,
    name,
    version,
  });
}

export async function createPipeline(pipeline: Pipeline, pipelineRepository: PipelineRepository): Promise<Pipeline> {
  return pipelineRepository.create(pipeline);
}
