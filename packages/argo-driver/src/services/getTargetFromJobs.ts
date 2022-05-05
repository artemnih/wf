import {MinimalJob} from '../types';

export enum Target {
  outputs,
  logs,
}
export function getTargetFromJobs(
  jobs: MinimalJob[],
  outputOrLog: Target,
): Record<string, string> {
  const outputObject: Record<string, string> = {};
  const isKeyLog = (key: string) =>
    key.endsWith('StdOut') || key.endsWith('StdErr') || key.endsWith('Logs');
  for (const job of jobs) {
    for (const [key, value] of Object.entries(job.outputs)) {
      if (outputOrLog === Target.logs && isKeyLog(key)) {
        outputObject[key] = value;
      } else if (outputOrLog === Target.outputs && !isKeyLog(key)) {
        outputObject[key] = value;
      }
    }
  }
  return outputObject;
}
