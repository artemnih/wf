import { Step } from '../../../types';

export function determineDependencies(
  step: Step,
): string[] {
  // Argo DAG has the following syntax to determine dependencies:
  // dependencies = ['step that this one depends on']
  // CWL does not use dag but it is determined by data flow.
  // stepA: out: [outputA]
  // stepB: in: stepA/outputA
  // This function will scan and determine dependencies.
  // We also use outputA to add the correct parameters to the next step.
  const dependencies = [];

  const cwlStepIn = step.in
  const cwlStepName = step.name

  // const _cwlStepIn = JSON.stringify(cwlStepIn, null, 2);
  // console.log(`find dependencies for input : ${cwlStepName}`)

  for (const input in cwlStepIn) {
    let [inputName, inputValue] = cwlStepIn[input].split('/');
      if(inputName && inputValue) {
        if(inputName != cwlStepName) {
          dependencies.push(inputName);
        }
      }
  }

  // const _dependencies = JSON.stringify(dependencies, null, 2);
  // console.log(`got : ${_dependencies}`)

  return dependencies;
}
