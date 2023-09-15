import {CwlScriptInAndOut} from '../../types';
export interface MappedOutput {
  outputName?: string;
  inputName?: string;
}
export function mapOutputToInputs(cwlScripts: CwlScriptInAndOut[]) {
  const arrayOuts = cwlScripts[0].out;
  if (Array.isArray(arrayOuts) && arrayOuts.length === 0) {
    return [{}];
  }
  const arrayOutputs: MappedOutput[] = [];
  cwlScripts.forEach((element) => {
    for (const val in element.out) {
      const outputVal = element.cwlScript.outputs[element.out[val]];
      if (outputVal.type !== 'Directory') {
        continue;
      }
      // CWL format for directory: $(inputs.outDir.basepath)
      // substr 2 skips the first two element and the second value tells the input value.
      const outputDirName = outputVal.outputBinding.glob.substr(2).split('.');
      arrayOutputs.push({
        outputName: element.out[val],
        inputName: element.in[outputDirName[1]],
      });
    }
  });
  return arrayOutputs;
}
