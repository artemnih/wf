import {ChildProcess, spawn} from 'child_process';

export function spawnGenericCwlRunner(
  cwlWorkflow: string,
  cwlJobInputs: string,
  currentDir: string,
  workflowId: string,
): ChildProcess {
  return spawn(
    'toil-cwl-runner',
    [
      '--singularity',
      '--dont_allocate_mem',
      '--bypass-file-store',
      '--jobStore',
      `${currentDir}/${workflowId}`,
      '--tmpdir-prefix',
      `${currentDir}/${workflowId}`,
      '--tmp-outdir-prefix',
      `${currentDir}/${workflowId}`,
      '--batchSystem',
      'slurm',
      '--log-dir',
      `${currentDir}/${workflowId}-logs`,
      '--disableCaching',
      cwlWorkflow,
      cwlJobInputs,
    ],
    {
      cwd: currentDir,
    },
  );
}
