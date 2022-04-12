import { Pipeline, Workflow } from '../models';
import { default as axios } from 'axios';

export function workflowToPipeline(workflow: Workflow): Pipeline {
  return new Pipeline({
    inputs: workflow.inputs,
    outputs: workflow.outputs,
    steps: workflow.steps,
    name: workflow.name,
  });
}

export async function postPipeline(pipeline: Pipeline): Promise<Pipeline> {
  require('dotenv').config();
  const config = require('config');

  const url = `http://${config.compute.computeName}:${config.rest.port}/compute/pipelines`;

  const response = await axios.post(url, { ...pipeline });
  return response.data;
}
