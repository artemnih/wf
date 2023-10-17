import {
  CwlWorkflow,
  CLT,
  Step,
  ComputeJob,
} from '../../../types';
import {sanitizeStepName} from './sanitizeStepName';

/**
 * Create Steps from the CwlWorkflows steps and the ComputeJobs.
 * @param cwlWorkflow 
 * @param computeJobs 
 * @returns the list of steps, which the argo driver views of compute jobs.
 */
export function stepsFromWorkflow(
  cwlWorkflow: CwlWorkflow,
  computeJobs: ComputeJob[],
): Step[] {
  const steps: Step[] = [];

  for (const stepName in cwlWorkflow.steps) {

    const job = computeJobs.find(
      (job) => job.stepName === stepName,
    );

    if(!job) {
      throw Error(
        `Invalid request. 
        Could not find a compute job for cwl workflow step : ${stepName}.` 
      )
    }
    
    // NOTE because the scatter implementation relies on `run` 
    // to be a string, we need to get the clt from computeJob
    // rather than CwlWorklow.Step
    const clt = job.commandLineTool as CLT;

    const step: Step = {
      name: stepName,
      clt: clt,
      in: cwlWorkflow.steps[stepName].in,
      out: cwlWorkflow.steps[stepName].out,
    };

    if (cwlWorkflow.steps[stepName].scatter) {
      step.scatter = cwlWorkflow.steps[stepName].scatter;
    }

    if (cwlWorkflow.steps[stepName].when) {
      step.when = cwlWorkflow.steps[stepName].when;
    }
    
    steps.push(step);
  }
  return steps;
}
