Abstraction for HPC drivers

The interface is hpc.cli.ts.

HPC has three major apps - status, queue and cancel

slurm.ts implements the subprocess calls so you can call the slurm cli.
