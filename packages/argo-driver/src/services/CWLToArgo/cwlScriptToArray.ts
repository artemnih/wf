import {
  CwlWorkflow,
  CwlScript,
  CwlScriptInAndOut,
  MinimalJob,
} from '../../types';

/**
 * Apparently scripts here are the description of the CLT embedded in each step
 * augmented with some information from compute (workflowId, creation data)
 * along with input and output definitions from each associated step.
 * @param cwlWorkflow 
 * @param jobs 
 * @returns scripts
 */
export function scriptsFromWorkflow(
  cwlWorkflow: CwlWorkflow,
  jobs: MinimalJob[],
): CwlScriptInAndOut[] {
  const scriptArray: CwlScriptInAndOut[] = [];

  /**
   * Apparently use ordering correspondance between jobs (corresponding to ) and steps
   */
  let index = 0;
  for (const property in cwlWorkflow.steps) {
    const cwlScript = jobs[index].commandLineTool as CwlScript;
    const script: CwlScriptInAndOut = {
      cwlScript,
      in: cwlWorkflow.steps[property].in,
      out: cwlWorkflow.steps[property].out,
    };
    //TODO CHECK what scatter does
    if (cwlWorkflow.steps[property].scatter) {
      script.scatter = cwlWorkflow.steps[property].scatter;
    }
    //TOOD CHECK WHAT when does
    if (cwlWorkflow.steps[property].when) {
      script.when = cwlWorkflow.steps[property].when;
    }
    scriptArray.push(script);
    index = index + 1;
  }
  return scriptArray;
}
