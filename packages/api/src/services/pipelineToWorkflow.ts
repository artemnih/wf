import { Pipeline, Workflow } from '../models';
import { existsSync, readFileSync } from 'fs';
import { PipelineRepository } from '../repositories';
import { HttpErrors } from '@loopback/rest';

export interface CwlStep {
  [key: string]: CwlStepEntry;
}
export interface CwlStepEntry {
  run: string;
  in: object;
  out: string[];
  scatter?: string;
}
export async function pipelineToWorkflow(workflowWithPipeline: Workflow, pipelineRepository: PipelineRepository): Promise<Workflow> {
  const returnedWorkflow = await setCwlStep(workflowWithPipeline, pipelineRepository);
  return returnedWorkflow;
}
export async function setCwlStep(workflowWithPipeline: Workflow, pipelineRepository: PipelineRepository): Promise<Workflow> {
  const workflowToReturn = { ...workflowWithPipeline };
  workflowToReturn.steps = {};
  const cwlStepKeys = Object.keys(workflowWithPipeline.steps);
  for (const key of cwlStepKeys) {
    const cwlStepEntry: CwlStep = {};
    const pipelineOrPlugin = (workflowWithPipeline.steps as CwlStep)[key].run;
    cwlStepEntry[key] = (workflowWithPipeline.steps as CwlStep)[key];
    const cwlKey = await convertWorkflowStepWithPipeline(pipelineOrPlugin, cwlStepEntry, pipelineRepository);
    (workflowToReturn.steps as CwlStep) = { ...workflowToReturn.steps, ...cwlKey };
  }
  return new Workflow(workflowToReturn);
}
export async function convertWorkflowStepWithPipeline(
  pipelineKey: string,
  cwlStepToReplace: CwlStep,
  pipelineRepository: PipelineRepository,
): Promise<CwlStep> {
  if (pipelineKey.includes('plugin:')) {
    return cwlStepToReplace;
  }
  const pipeline = await getPipeline(pipelineKey, pipelineRepository);
  return pipeline.steps as CwlStep;
}
async function getPipeline(path: string, pipelineRepository: PipelineRepository) {
  // For unit testing, don't use the compute api to get pipelines from mongo.
  const pathSplit = path.split(':');
  if (existsSync(pathSplit[1])) {
    const pipeline = JSON.parse(readFileSync(pathSplit[1], 'utf8'));
    return new Pipeline(pipeline);
  }
  const plugin = await pipelineRepository.findOne({ where: { name: pathSplit[1], version: pathSplit[2] } });
  if (!plugin) {
    throw new HttpErrors.NotFound(`The plugin with name of ${pathSplit[1]} and version of ${pathSplit[2]} was not found`);
  }
  return plugin as Pipeline;
}
