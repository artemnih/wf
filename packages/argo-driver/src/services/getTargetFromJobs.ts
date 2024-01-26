import { ComputeJob } from '../types';

export enum Target {
  outputs,
  logs,
}

const isKeyLog = (key: string) =>
  key.endsWith('StdOut') || key.endsWith('StdErr') || key.endsWith('Logs');

export function getTargetFromJobs(
  jobs: ComputeJob[],
  outputOrLog: Target,
): Record<string, string> {
  const outputObject: Record<string, string> = {};

  for (const job of jobs) {
    for (const [key, value] of Object.entries(job.outputs)) {
      if (outputOrLog === Target.logs && isKeyLog(key) || outputOrLog === Target.outputs && !isKeyLog(key)) {
        outputObject[key] = value;
      }
    }
  }
  return outputObject;
}
