import { Step } from '../../../types';

/**
 * This function will scan and determine dependencies for a given step.
 * Argo DAG has the following syntax to determine dependencies:
 * dependencies = ['step that this one depends on']
 * CWL does not use explicit dependencies but dependencies are
 * determined the by the declared data flow.
 * if stepA: out: [outputA]
 * and if stepB: in: stepA/outputA
 * then stepB depends on stepA
 * @param step the given step
 * @returns the list of stepNames this step depends on.
 */
export function determineDependencies(
  step: Step,
): string[] {
  const dependencies : string[] = [];

  const cwlStepIn = step.in
  const cwlStepName = step.name

  for (const input in cwlStepIn) {
    let [inputName, inputValue] = cwlStepIn[input].split('/');
      if(inputName && inputValue) {
        if(inputName != cwlStepName) {
          dependencies.push(inputName);
        }
      }
  }

  return dependencies;
}
