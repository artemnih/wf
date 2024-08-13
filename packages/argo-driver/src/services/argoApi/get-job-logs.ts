import { sanitizeStepName } from '../CWLToArgo/utils/sanitize-step-name';
import { logger } from '@polusai/compute-common';
import { axiosClient } from './axios-client';
import { ArgoJobStatus, ArgoNodes } from './getArgoJobStatus';
import { parseLogs } from './parse-logs';

export async function getJobLogs(workflowId: string, jobName: string) {
	logger.info(`Getting logs for job "${jobName}" in workflow "${workflowId}"`);
	const workflow = (await axiosClient().get(`/${workflowId}`)) as ArgoJobStatus;
	const pods = Object.values(workflow.data.status.nodes).filter(value => value.type === 'Pod') as Array<ArgoNodes>;
	const sanitizedStepName = sanitizeStepName(jobName);
	const pod = pods.find(pod => pod.templateName === sanitizedStepName);
	if (!pod) {
		return 'No logs found. Pod not found. Try again later or check pod name.';
	}
	const podId = pod.id;
	const url = `/${workflowId}/log?logOptions.container=wait&podName=${podId}`;
	logger.info('Getting logs from:', url);
	const results = await axiosClient().get(url);
	const data = results.data;
	const content = parseLogs(data);
	return content;
}
