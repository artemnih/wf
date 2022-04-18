import {convertStatusToString, JobHPC} from '.';
export interface HPCStatus {
  jobId: string;
  jobName: string;
  driver: string;
  workflowId: string;
  status: string;
  dateCreated: string;
  dateFinished: string;
  inputs: object;
  outputs: object;
}

export const statusOfEachJob = (hpcStatus: JobHPC[]) => {
  // The stdout of cwltool outputs all the outputs of the workflow
  // Jobs has the outputs of each step.
  const jobs: HPCStatus[] = [];
  hpcStatus.forEach((value, index) => {
    jobs.push({
      jobId: value.jobId,
      driver: value.driver,
      status: convertStatusToString(value.status),
      jobName: value.jobName,
      dateCreated: value.dateCreated,
      dateFinished: value.dateFinished,
      workflowId: value.workflowId,
      inputs: value.inputs,
      outputs: value.outputs,
    });
  });
  return jobs;
};
