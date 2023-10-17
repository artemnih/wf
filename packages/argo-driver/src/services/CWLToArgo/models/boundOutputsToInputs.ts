import {BoundOutput, Step} from '../../../types';

/**
 * Check if each step output is bounded to a step input.
 * TODO CHECK the cwl spec and identify cases.
 * It seems that the cases management here is weak.
 * What happen for each output type etc..
 * @param steps 
 * @returns 
 */
export function boundOutputsToInputs(steps: Step[]) {

  // TODO some kind of edge case here, (probaly to handle this scatter thing)
  // but not quite sure what edge case it is really addressing
  // and if generic enough plus it is messing up typing
  const arrayOuts = steps[0].out;
  if (Array.isArray(arrayOuts) && arrayOuts.length === 0) {
    return [{}];
  }

  const boundOutputs: BoundOutput[] = [];

  steps.forEach((step) => {
    for (const output of step.out) {

      // get the clt binding for this step output
      const outputValue = step.clt.outputs[output];

      if (outputValue.type !== 'Directory') {
        throw Error(
          `Unsupported Case. ${step.name} output ${output} is of type ${outputValue.type},
          which is currently unsupported. If you think it is a bug,
          please file an issue to the developers.`
        );
      }

      // CWL format for directory:  $(inputs.outDir.basepath)
      const [ , inputParam, ] = outputValue.outputBinding.glob.split('.');

      boundOutputs.push({
        stepName: step.name,
        outputName: output,
        inputName: step.in[inputParam],
      });
    }
  });

  return boundOutputs;
}
