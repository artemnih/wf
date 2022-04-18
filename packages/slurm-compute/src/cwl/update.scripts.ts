import {CwlWorkflowTemplate} from '../types';
import {writeFileSync} from 'fs';
import {Job} from './driver.cwltool';
import {replaceKeyName} from './replace.key.name';
require('dotenv').config();
const config = require('config');

const cwlFsPath = config.slurmCompute.data;

export function updateStepsWithScripts(
  cwlWorkflow: CwlWorkflowTemplate,
  jobs: Job[],
  fileHandler = (
    script: object,
    runId: string,
    basePath: string = cwlFsPath,
  ) => {
    // MONGO does not allow $ as key names.
    // We need to rename namespaces to $namespaces and schemas to $schemas.
    writeFileSync(
      `${basePath}/${runId}.cwl`,
      JSON.stringify(replaceKeyName(script as Record<string, unknown>)),
    );

    return `${basePath}/${runId}.cwl`;
  },
): CwlWorkflowTemplate {
  const cwlToModify = {...cwlWorkflow};
  interface KeyObject {
    key: string;
    runId: string;
  }
  const runKeys: Array<KeyObject> = [];
  let index = 0;
  for (const [key] of Object.entries(cwlWorkflow.steps)) {
    const runId = cwlToModify.steps[key].run;
    const value = fileHandler(jobs[index].commandLineTool, runId);
    runKeys.push({key, runId: value});
    index = index + 1;
  }
  runKeys.forEach((value) => {
    cwlToModify.steps[value.key].run = value.runId;
  });
  return cwlToModify;
}
