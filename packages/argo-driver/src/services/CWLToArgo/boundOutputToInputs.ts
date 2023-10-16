import {Step} from '../../types';
export interface BoundOutput {
  stepName?: string
  outputName?: string;
  inputName?: string;
}

/**
 * Check if each step output is bounded to a step input.
 * TODO NOTE not quite sure of the necessity of this 
 * ( would require a deeper look at the CWL spec)
 * It seems in any case that the cases management is weak.
 * What happen for each output type etc..
 * @param steps 
 * @returns 
 */
export function boundStepOutputToStepInputValue(steps: Step[]) {

  // TODO some kind of edge case here
  // but not quite sure what edge case it is really addressing
  // and if generic enough
  // plus it is messing up typing
  const arrayOuts = steps[0].out;
  if (Array.isArray(arrayOuts) && arrayOuts.length === 0) {
    return [{}];
  }

  const arrayOutputs: BoundOutput[] = [];
  steps.forEach((step) => {
    // for each step OUTPUT, find the clt's outputBinding.
    // it should be of the form $(inputs.OUTPUT_NAME.basepath)
    // then check the input for the value of OUTPUT_NAME and rec
    for (const output in step.out) {
      const outputVal = step.clt.outputs[step.out[output]];

      //TODO CHECK the CWL spec to identify when this happens. 
      // Or if this could ever happen
      if (outputVal.type !== 'Directory') {
        continue;
      }

      // CWL format for directory:  $(inputs.outDir.basepath)
      // TODO yes but what about other param than directory?
      const outputDirName = outputVal.outputBinding.glob.split('.');
      arrayOutputs.push({
        stepName: step.name,
        outputName: step.out[output],
        inputName: step.in[outputDirName[1]],
      });
    }
  });

  return arrayOutputs;
}
