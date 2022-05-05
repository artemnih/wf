import {
  CwlWorkflow,
  CwlScript,
  CwlScriptInAndOut,
  MinimalJob,
} from '../../types';

export function scriptsFromWorkflow(
  cwlWorkflow: CwlWorkflow,
  jobs: MinimalJob[],
): CwlScriptInAndOut[] {
  const scriptArray: CwlScriptInAndOut[] = [];

  let index = 0;
  for (const property in cwlWorkflow.steps) {
    const cwlScript = jobs[index].commandLineTool as CwlScript;
    const script: CwlScriptInAndOut = {
      cwlScript,
      in: cwlWorkflow.steps[property].in,
      out: cwlWorkflow.steps[property].out,
    };
    if (cwlWorkflow.steps[property].scatter) {
      script.scatter = cwlWorkflow.steps[property].scatter;
    }
    if (cwlWorkflow.steps[property].when) {
      script.when = cwlWorkflow.steps[property].when;
    }
    scriptArray.push(script);
    index = index + 1;
  }
  return scriptArray;
}
