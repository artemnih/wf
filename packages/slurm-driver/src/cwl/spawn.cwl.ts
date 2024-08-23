import { ChildProcess, spawn } from 'child_process';
import { mkdir, mkdirSync } from 'fs';
var fs = require('fs');

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

export function spawnGenericCwlRunner2(
	cwlWorkflow: string,
	cwlJobInputs: string,
	currentDir: string,
	workflowId: string,
	config: Array<string>,
): ChildProcess {
	// create directory for workflow
	if (!fs.existsSync(`${currentDir}/${workflowId}`)) {
		mkdirSync(`${currentDir}/${workflowId}`);
	}

	// run toil from command line
	const result = spawn(
		'toil-cwl-runner',
		[
			cwlWorkflow,
			cwlJobInputs,
			'--outdir',
			`${currentDir}/${workflowId}/out`,
			'--logFile',
			`${currentDir}/${workflowId}/logs/toil_run_${workflowId}.log`,
			'--batchSystem',
			'slurm',
			'--jobStore',
			`${currentDir}/${workflowId}/job`,
		].concat(config), // add custom configs to toil call
	);

	return result;
}
