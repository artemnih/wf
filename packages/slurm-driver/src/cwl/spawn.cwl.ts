import { ChildProcess, spawn } from 'child_process';
import { mkdirSync } from 'fs';
var fs = require('fs');
import path from 'path';

export function spawnGenericCwlRunner(
	cwlWorkflow: string,
	cwlJobInputs: string,
	toilOutputDir: string,
	toilLogsDir: string,
	config: Array<string> = [],
): ChildProcess {
	const toilLogFile = path.join(toilLogsDir, `toil.log`);
	//create log file
	fs.writeFileSync(toilLogFile, '', { flag: 'w' });

	// run toil from command line
	const result = spawn(
		'toil-cwl-runner',
		[cwlWorkflow, cwlJobInputs, '--outdir', toilOutputDir, '--logFile', toilLogFile, '--batchSystem', 'slurm'].concat(config), // add custom configs to toil call
	);

	return result;
}
