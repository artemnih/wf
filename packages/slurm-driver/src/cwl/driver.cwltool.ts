import {writeFileSync, createWriteStream, readFileSync, existsSync} from 'fs';
import {updateStepsWithScripts} from './update.scripts';
import {CwlWorkflowTemplate} from '../types';
import {spawnGenericCwlRunner} from './spawn.cwl';
import {DateType} from '@loopback/repository';
import {JobOutput, locationFromOutput, OutputDict} from '.';
import {WorkflowStatus} from '../types/workflowStatus';
import {addOperators} from './add.operators';
require('dotenv').config();
const slurmConfig = require('config');

export interface Job {
  id: string;
  driver: string;
  workflowId: string;
  status: string;
  outputs: Record<string, string>;
  inputs: object;
  stepName: string;
  commandLineTool: object;
  dateCreated: string;
  dateFinished: string;
  scriptPath: string;
}
export function cwlCompute(
  cwlWorkflow: object,
  cwlJobInputs: object,
  jobs: Job[],
): void {
  const basePath = slurmConfig.slurmCompute.data;
  let cwlWorkflowModified = updateStepsWithScripts(
    cwlWorkflow as CwlWorkflowTemplate,
    jobs,
  );
  cwlWorkflowModified = addOperators(
    cwlWorkflow as CwlWorkflowTemplate,
    'src/operators/cwl-filepattern-plugin.cwl',
    basePath,
    'cwl-filepattern-plugin.cwl',
  );
  const workflowId = jobs[0].workflowId;
  writeFileSync(
    `${basePath}/${workflowId}-workflow.cwl`,
    JSON.stringify(cwlWorkflowModified),
  );
  writeFileSync(
    `${basePath}/${workflowId}-params.json`,
    JSON.stringify(cwlJobInputs),
  );
  runLocalCwl(
    `${basePath}/${workflowId}-workflow.cwl`,
    `${basePath}/${workflowId}-params.json`,
    jobs,
  );
}

export function runLocalCwl(
  cwlWorkflow: string,
  cwlJobInputs: string,
  jobs: Job[],
  currentDir: string = slurmConfig.slurmCompute.data,
): void {
  const workflowId = jobs[0].workflowId;
  const cwlTool = spawnGenericCwlRunner(
    cwlWorkflow,
    cwlJobInputs,
    currentDir,
    workflowId,
  );
  const outJson = `${currentDir}/${workflowId}.out.json`;
  const dateCreated = new DateType().defaultValue().toISOString();
  let status: WorkflowStatus = {
    status: 'PENDING',
    dateCreated,
    dateFinished: '',
  };
  updateStatus(workflowId, status, currentDir);

  const logStream = createWriteStream(outJson, {flags: 'w'});
  cwlTool.stdout.pipe(logStream);

  cwlTool.stderr.on('data', (data: string) => {
    updateStatus(
      workflowId,
      {status: 'RUNNING', dateCreated, dateFinished: ''},
      currentDir,
    );

    console.log(`stderr: ${data}`);
  });

  cwlTool.on('close', (code: string) => {
    let statusMessage = 'COMPLETED';
    const conditionalCode = code ? code.toString() : '';
    if (conditionalCode) {
      console.log(`child process exited with code ${code.toString()}`);
      statusMessage = code.toString() === '0' ? 'COMPLETED' : 'ERROR';
    }
    status = {
      status: statusMessage,
      dateCreated,
      dateFinished: new DateType().defaultValue().toISOString(),
    };
    updateStatus(workflowId, status, currentDir);
  });
}
export const getOutputOfJobs = (cwlOutputs: OutputDict) => {
  const allOutputs: Record<string, string | string[] | number | boolean> = {};
  for (const [key, value] of Object.entries(cwlOutputs)) {
    if (!Array.isArray(value)) {
      if (!isOutputALogFile(key))
        allOutputs[key] = locationFromOutput(value as OutputDict);
    } else {
      if (!isOutputALogFile(key)) {
        allOutputs[key] = (value as JobOutput[]).map((output) =>
          locationFromOutput(output as OutputDict),
        ) as string[];
      }
    }
  }
  return allOutputs;
};
export const getWorkflowLogs = (cwlOutputs: OutputDict) => {
  const allOutputs: Record<string, string | string[] | number | boolean> = {};
  for (const [key, value] of Object.entries(cwlOutputs)) {
    if (!Array.isArray(value)) {
      if (isOutputALogFile(key)) {
        allOutputs[`${key}`] = locationFromOutput(value as OutputDict);
      }
    } else {
      if (isOutputALogFile(key)) {
        allOutputs[key] = (value as JobOutput[]).map((output) =>
          locationFromOutput(output as OutputDict),
        ) as string[];
      }
    }
  }
  return allOutputs;
};
const isOutputALogFile = (value: string) => {
  return (
    value.endsWith('StdOut') ||
    value.endsWith('StdErr') ||
    value.endsWith('Logs')
  );
};

export const updateStatus = (
  workflowId: string,
  workflowStatus: WorkflowStatus,
  currentDir: string,
) => {
  const statusFile = `${workflowId}.status.json`;
  // I don't really know a better way.
  // If someone tells a workflow to be cancelled, we will assume that is the final state.
  // Therefore, we should read the file and see if we shouldn't update.

  const statusPath = `${currentDir}/${statusFile}`;
  if (existsSync(statusPath)) {
    const currentStatus = JSON.parse(
      readFileSync(statusPath, 'utf8'),
    ) as WorkflowStatus;
    if (currentStatus.status === 'CANCELLED') return;
  }
  writeFileSync(statusPath, JSON.stringify(workflowStatus));
};
