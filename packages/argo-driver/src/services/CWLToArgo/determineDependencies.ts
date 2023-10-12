import { CwlScriptInAndOut } from '../../types';

export function determineDependencies(
  cwlStepInAndOut: CwlScriptInAndOut,
): string[] {
  // Argo DAG has the following syntax to determine dependencies:
  // dependencies = ['step that this one depends on']
  // CWL does not use dag but it is determined by data flow.
  // stepA: out: [outputA]
  // stepB: in: stepA/outputA
  // This function will scan and determine dependencies.
  // We also use outputA to add the correct parameters to the next step.
  const dependencies = [];

  const cwlStepIn = cwlStepInAndOut.in
  //TODO CHECK HERE it seems the problem with step name being identified to cwlScript.id,
  //which represents the container id, this is not necessarily the same
  const cwlStepName = cwlStepInAndOut.cwlScript.id

  // const _cwlStepIn = JSON.stringify(cwlStepIn, null, 2);
  // console.log(`find dependencies for input : ${cwlStepName}`)

  //TODO here dependencies are correctly identified leveraging CWL spec,
  //but again cwlStepName is incorrect
  for (const key in cwlStepIn) {
    const token = cwlStepIn[key].split('/');
    if (token.length > 1) {
      if(token[0] != cwlStepName) {
        dependencies.push(token[0]);
      }
    }
  }

  // const _dependencies = JSON.stringify(dependencies, null, 2);
  // console.log(`got : ${_dependencies}`)

  return dependencies;
}
