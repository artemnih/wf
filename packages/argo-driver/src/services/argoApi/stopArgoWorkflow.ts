import { axiosClient } from '.';
import { logger } from '../logger';

export async function stopArgoWorkflow(workflowName: string): Promise<void> {
	const response = await axiosClient().put(`/${workflowName}/terminate`);
	if (response.status !== 200) logger.error(JSON.stringify(response.data));
	if (response.status === 200) logger.info(`Workflow ${workflowName} was stopped`);
}
