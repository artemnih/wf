import {HpcCli, jobFromHpc, JobHPC} from '../../hpc';
import {spawnSync} from 'child_process';

const mockedGetInputsFromCwl = (
  workflowId: string,
  jobName: string,
  scatterIndex = -1,
  workflowHandler = (file: string) => {
    return {};
  },
  parametersHandler = (file: string) => {
    return {};
  },
) => {
  return {};
};
const mockedGetOutputsFromCwl = (
  workflowId: string,
  jobName: string,
  scatterIndex = -1,
  workflowHandler = (file: string) => {
    return {};
  },
  parametersHandler = (file: string) => {
    return {};
  },
) => {
  return {};
};

export class TestHPCCli implements HpcCli {
  kill(id: string): void {
    spawnSync('echo', [id]);
  }
  statusOfJob(id: string): JobHPC {
    const jobStatus = spawnSync('echo', [',0.0000,0.0001,RUNNING']);
    return jobFromHpc(
      id,
      jobStatus.output.toString().replace(',', ''),
      mockedGetInputsFromCwl,
      mockedGetOutputsFromCwl,
    );
  }
  jobNamesFromWorkflow(id: string): string[] {
    return [`toil_job_2_${id}.echo`];
  }
}
