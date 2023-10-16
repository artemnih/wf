import {
  CwlWorkflow,
  CLT,
  Step as Step,
  ComputeJob,
} from '../../types';

/**
 * Apparently scripts here are the description of the CLT embedded in each step
 * augmented with some information from compute (workflowId, creation data)
 * along with input and output definitions from each associated step.
 * @param cwlWorkflow 
 * @param jobs 
 * @returns scripts
 */
export function stepsFromWorkflow(
  cwlWorkflow: CwlWorkflow,
  jobs: ComputeJob[],
): Step[] {
  const steps: Step[] = [];

  /**
   * Apparently use ordering correspondance between jobs (corresponding to ) and steps
   * which is quite brittle.
   * In any case the only goal here seems to gather information we already have so we should be 
   * good with remove all of it altogether.
   * TODO todo check how scatter and when are injected.
   * TODO probably do not use and just use ComputeJobs instead.
   */
  let index = 0;
  for (const stepName in cwlWorkflow.steps) {
    const clt = jobs[index].commandLineTool as CLT;
    const step: Step = {
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
    index = index + 1;
  }
  return steps;
}
