import {copyFileSync} from 'fs';
import {CwlWorkflowTemplate, StepTemplate} from '../types';

export function addOperators(
  cwlWorkflow: CwlWorkflowTemplate,
  srcPath: string,
  configPath: string,
  destPath: string,
  copyHandler = (src = srcPath, config = configPath, dest = destPath) => {
    copyFileSync(src, `${config}/${dest}`);
  },
) {
  // Scan workflow for scatter
  let dynamicScatterFound = false;
  const replaceStep: Record<string, string> = {};
  let index = 1;
  for (const [, value] of Object.entries(cwlWorkflow.steps)) {
    if (value.scatter) {
      for (const [inputKey, inputValue] of Object.entries(value.in)) {
        if (value.scatter === inputKey) {
          dynamicScatterFound = (inputValue as string).includes('/');
          if (dynamicScatterFound) {
            const operatorValue =
              index === 1
                ? `cwlOperator/filePatterns`
                : `cwlOperator-${index}/filePatterns`;
            (value.in as Record<string, string>)[`${inputKey}`] = operatorValue;
            replaceStep[operatorValue] = inputValue as string;
            index += 1;
          }
        }
      }
    }
  }
  if (!dynamicScatterFound) return cwlWorkflow;

  const keys = Object.keys(replaceStep);
  index = 1;
  const cwlOperator: Record<string, StepTemplate> = {};
  const originalSteps = cwlWorkflow.steps;
  console.log(keys);
  for (const dynamicScatter of keys) {
    const operator: StepTemplate = {
      run: `${configPath}/cwl-filepattern-plugin.cwl`,
      in: {
        input: replaceStep[dynamicScatter],
      },
      out: ['filePatterns'],
    };
    const operatorKey = index === 1 ? 'cwlOperator' : `cwlOperator-${index}`;
    cwlOperator[operatorKey] = operator;
    index = index + 1;
    cwlWorkflow.steps = {...cwlOperator};
  }
  cwlWorkflow.steps = {...cwlWorkflow.steps, ...originalSteps};

  copyHandler();
  return cwlWorkflow;
}
