import { ChildProcess, spawn } from 'child_process';
import { mkdir, mkdirSync } from 'fs';
var fs = require('fs');

export function spawnGenericCwlRunner(
	cwlWorkflow: string,
	cwlJobInputs: string,
	currentDir: string,
	workflowId: string,
	config: Array<string>=[],
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
