import {spawnSync} from 'child_process';
import {getInputsFromCwl, getOutputsFromCwl} from '../cwl';
import {HpcCli, JobHPC} from './hpc.cli';
import {jobNamesFromHPCStatus} from './job.names.from.hpcStatus';
import {jobFromHpc} from './job.from.hpc';

export class SlurmCli implements HpcCli {
  kill(id: string): void {
    console.log('Calling scancel --name', id);
    spawnSync('scancel', ['--name', id]);
  }
  statusOfJob(id: string): JobHPC {
    const jobStatus = spawnSync('sacct', [
      '-n',
      '-p',
      '--delimiter=,',
      '--format=Start,End,State',
      '--name',
      id,
    ]);
    console.log(
      `Running sacct -n -p --delimiter=, --format=Start,End,State --name ${id}`,
    );
    return jobFromHpc(
      id,
      jobStatus.output.toString(),
      getInputsFromCwl,
      getOutputsFromCwl,
    );
  }
  jobNamesFromWorkflow(id: string): string[] {
    const jobNames = spawnSync('sacct', ['-n', '--format=jobname%500']);
    console.log(`Running sacct -n --format=jobname%500`);
    return jobNamesFromHPCStatus(jobNames.output.toString(), id);
  }
}
