import { sanitizeStepName } from '../CWLToArgo/utils/sanitize-step-name';
import { axiosClient } from './axios-client';
import { ArgoJobStatus, ArgoNodes } from './getArgoJobStatus';
import { parseLogs } from './parse-logs';

export async function getJobLogs(workflowId: string, jobName: string) {
	console.log(`Getting logs for job "${jobName}" in workflow "${workflowId}"`);
	const workflow = (await axiosClient().get(`/${workflowId}`)) as ArgoJobStatus;
	const pods = Object.values(workflow.data.status.nodes).filter(value => value.type === 'Pod') as Array<ArgoNodes>;
	const sanitizedStepName = sanitizeStepName(jobName);
	const pod = pods.find(pod => pod.templateName === sanitizedStepName);
	const podId = pod.id;
	const url = `/${workflowId}/log?logOptions.container=wait&logOptions.follow=true&podName=${podId}`;
	const results = await axiosClient().get(url);
	const data = results.data;
	const content = parseLogs(data);
	return content;
}
