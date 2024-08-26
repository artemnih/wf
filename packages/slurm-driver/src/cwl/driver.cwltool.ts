import { writeFileSync, createWriteStream, readFileSync, existsSync } from 'fs';
import { updateStepsWithScripts } from './update.scripts';
import { CwlWorkflowTemplate } from '../types';
import { spawnGenericCwlRunner } from './spawn.cwl';
import { JobOutput, locationFromOutput, OutputDict } from '.';
import { WorkflowStatus } from '../types/workflowStatus';
import { addOperators } from './add.operators';
require('dotenv').config();
const slurmConfig = require('config');

export interface Job {
	id: string;
	driver: string;
	workflowId: string;
	status: string;
	outputs: Record<string, string>;
	inputs: object;
	stepName: string;
	commandLineTool: object;
	dateCreated: string;
	dateFinished: string;
	scriptPath: string;
}

export const getOutputOfJobs = (cwlOutputs: OutputDict) => {
	const allOutputs: Record<string, string | string[] | number | boolean> = {};
	for (const [key, value] of Object.entries(cwlOutputs)) {
		if (!Array.isArray(value)) {
			if (!isOutputALogFile(key)) allOutputs[key] = locationFromOutput(value as OutputDict);
		} else {
			if (!isOutputALogFile(key)) {
				allOutputs[key] = (value as JobOutput[]).map(output => locationFromOutput(output as OutputDict)) as string[];
			}
		}
	}
	return allOutputs;
};
export const getWorkflowLogs = (cwlOutputs: OutputDict) => {
	const allOutputs: Record<string, string | string[] | number | boolean> = {};
	for (const [key, value] of Object.entries(cwlOutputs)) {
		if (!Array.isArray(value)) {
			if (isOutputALogFile(key)) {
				allOutputs[`${key}`] = locationFromOutput(value as OutputDict);
			}
		} else {
			if (isOutputALogFile(key)) {
				allOutputs[key] = (value as JobOutput[]).map(output => locationFromOutput(output as OutputDict)) as string[];
			}
		}
	}
	return allOutputs;
};
const isOutputALogFile = (value: string) => {
	return value.endsWith('StdOut') || value.endsWith('StdErr') || value.endsWith('Logs');
};

export const updateStatus = (workflowId: string, workflowStatus: WorkflowStatus, currentDir: string) => {
	const statusFile = `${workflowId}.status.json`;
	// I don't really know a better way.
	// If someone tells a workflow to be cancelled, we will assume that is the final state.
	// Therefore, we should read the file and see if we shouldn't update.

	const statusPath = `${currentDir}/${statusFile}`;
	if (existsSync(statusPath)) {
		const currentStatus = JSON.parse(readFileSync(statusPath, 'utf8')) as WorkflowStatus;
		if (currentStatus.status === 'CANCELLED') return;
	}
	writeFileSync(statusPath, JSON.stringify(workflowStatus));
};
