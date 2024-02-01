import { axiosClient } from './axios-client';
import { parseLogs } from './parse-logs';

export async function getWorkflowLog(id: string) {
	const payload = await axiosClient().get(`/${id}/log?logOptions.container=main&logOptions.follow=true`);
	const content = parseLogs(payload.data);
	return content;
}
