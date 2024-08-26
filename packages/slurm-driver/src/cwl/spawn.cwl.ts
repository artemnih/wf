import { ChildProcess, spawn } from 'child_process';
import { mkdirSync } from 'fs';
var fs = require('fs');
import path from 'path';

export function spawnGenericCwlRunner(
	cwlWorkflow: string,
	cwlJobInputs: string,
	currentDir: string,
	toilOutputDir: string,
	toilLogsDir: string,
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
			toilOutputDir,
			'--logFile',
			path.join(toilLogsDir, `toil.log`),
		].concat(config), // add custom configs to toil call
	)

	return result;
}
