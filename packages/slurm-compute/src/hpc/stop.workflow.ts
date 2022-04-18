import {spawnSync} from 'child_process';
import {HpcCli} from './hpc.cli';
import {SlurmCli} from './slurm';

export const toilKillHandler = (jobStoreLoc: string): void => {
  spawnSync('toil', ['kill', jobStoreLoc]);
  return;
};
export function stopWorkflow(
  id: string,
  hpcCli: HpcCli = new SlurmCli(),
  toilHandler = toilKillHandler,
) {
  require('dotenv').config();
  const slurmConfig = require('config');
  const jobStoreLoc = `${slurmConfig.slurmCompute.data}/${id}`;
  toilHandler(jobStoreLoc);
  const jobNames = hpcCli.jobNamesFromWorkflow(id);
  jobNames.forEach((element) => {
    hpcCli.kill(element);
  });
}
