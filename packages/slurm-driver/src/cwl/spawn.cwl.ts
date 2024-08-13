import { ChildProcess, spawn } from 'child_process';
var fs = require("fs");

export function spawnGenericCwlRunner(cwlWorkflow: string, cwlJobInputs: string, currentDir: string, workflowId: string): ChildProcess {
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

export function spawnGenericCwlRunner2(cwlWorkflow: string, cwlJobInputs: string, currentDir: string, workflowId: string, config: Array<string>): ChildProcess {
	const result = spawn(
		'toil-cwl-runner',
		[
			'--batchSystem',
			'slurm',
			'--disableCaching',
			'--jobStore',
			`${currentDir}/${workflowId}`,
			'--tmpdir-prefix',
			`${currentDir}/${workflowId}`,
			'--tmp-outdir-prefix',
			`${currentDir}/${workflowId}`,
			'--log-dir',
			`${currentDir}/${workflowId}-logs`,
			cwlWorkflow,
			cwlJobInputs,
		].concat(config) // add custom config
	);

	return result;
}