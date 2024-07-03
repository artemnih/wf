import { WorkflowStatus, WorkflowStatusPayload } from '@polusai/compute-common';
import { axiosClient } from '.';
import fs from 'fs';
import path from 'path';
import { logger } from '../logger';

require('dotenv').config();
const argoConfig = require('config');

type Dict<T> = { [key: string]: T };

// translate status value from Argo to Compute
export function translateStatus(phase: string) {
	switch (phase) {
		case 'Pending':
			return WorkflowStatus.PENDING;
		case 'Running':
			return WorkflowStatus.RUNNING;
		case 'Succeeded':
			return WorkflowStatus.SUCCEEDED;
		case 'Failed':
			return WorkflowStatus.FAILED;
		case 'Error':
			return WorkflowStatus.ERROR;
		case 'Skipped':
			return WorkflowStatus.SKIPPED;
		default:
			return phase;
	}
}

export async function statusOfArgoWorkflow(argoWorkflowName: string) {
	logger.info('Getting status of Argo workflow', argoWorkflowName);
	const response = await axiosClient().get(`/${argoWorkflowName}`);
	const nodes = response.data.status.nodes as Dict<any>;
	const wfId = response.data.metadata.name;

	const jobs = Object.values(nodes)
		.filter(node => node.type === 'Pod')
		.filter(node => node.templateName !== 'path-creator') // temp
		.map(node => {
			const id = (node.templateName || '').replace(/-/g, '_');
			// extract input parameters
			const params = node.inputs.parameters as Array<{ name: string; value: string; isDir: boolean; metadata: any }>;

			// if param value contains wfId, then it is a directory path, remove everyting before wfId
			// so that we do not expose the full path
			params.forEach(param => {
				if (param.value.includes(wfId)) {
					// split it
					const parts = param.value.split(wfId);

					// store it
					param.value = parts[1];

					// mark it as directory reference
					param.isDir = true;

					// get metadata of the folder
					const fullPath = path.join(argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath, wfId, parts[1]);
					if (fs.existsSync(fullPath)) {
						const metadata = fs.lstatSync(fullPath);
						const files = fs.readdirSync(fullPath);
						const formatCounts: Dict<number> = files.reduce((counts, file) => {
							const format = path.extname(file);
							if (format) {
								const formatWithoutDot = format.slice(1);
								counts[formatWithoutDot] = (counts[formatWithoutDot as keyof Dict<number>] || 0) + 1;
							}
							return counts;
						}, {} as Dict<number>);

						param.metadata = {
							size: metadata.size,
							created: metadata.birthtime,
							modified: metadata.mtime,
							numberOfFiles: files.length,
							formatCounts: formatCounts,
						};
					} else {
						logger.info(`Path does not exist: ${fullPath}`);
					}
				}
			});

			return {
				id: id,
				params: params,
				status: translateStatus(node.phase),
				startedAt: node.startedAt || '',
				finishedAt: node.finishedAt || '',
			};
		});

	return {
		status: translateStatus(response.data.status.phase),
		startedAt: response.data.status.startedAt || '',
		finishedAt: response.data.status.finishedAt || '',
		jobs: jobs,
	} as WorkflowStatusPayload;
}
