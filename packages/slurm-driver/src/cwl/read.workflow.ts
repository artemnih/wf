import { readFileSync } from 'fs';
import { CwlWorkflowTemplate } from '../types';
import { getBasePath } from './get.base.path';

export function readWorkflow(workflowId: string) {
	const basePath = getBasePath();
	const workflow = JSON.parse(readFileSync(`${basePath}/${workflowId}-workflow.cwl`, 'utf8'));
	return workflow as CwlWorkflowTemplate;
}
