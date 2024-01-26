import { readFileSync } from 'fs';
import { FileOrDirectoryInput } from '../types';
import { getBasePath } from './get.base.path';

export function readParameters(workflowId: string) {
	const basePath = getBasePath();
	const parameters = JSON.parse(readFileSync(`${basePath}/${workflowId}-params.json`, 'utf8'));
	return parameters as Record<string, string | FileOrDirectoryInput | string[]>;
}
