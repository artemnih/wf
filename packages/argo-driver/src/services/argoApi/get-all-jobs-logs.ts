import { axiosClient } from './axios-client';
import { ArgoJobStatus, ArgoNodes } from './getArgoJobStatus';
import { parseLogs } from './parse-logs';

export async function getAllJobsLogs(workflowId: string) {
	console.log('Getting Jobs Logs of Argo workflow', workflowId);
	const workflow = (await axiosClient().get(`/${workflowId}`)) as ArgoJobStatus;
	const pods = Object.values(workflow.data.status.nodes).filter(value => value.type === 'Pod') as Array<ArgoNodes>;
	const podNames = pods.map(pod => pod.id);
	const urls = podNames.map(podName => `/${workflowId}/log?logOptions.container=wait&logOptions.follow=true&podName=${podName}`);
	const promises = urls.map(url => axiosClient().get(url));
	const results = await Promise.all(promises);
	const datas = results.map(result => result.data);
	const contents = datas.map(data => parseLogs(data));
	return contents;
}
