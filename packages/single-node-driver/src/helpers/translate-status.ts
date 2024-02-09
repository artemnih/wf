import { WorkflowStatus } from '@polusai/compute-common';

export function translateCwlStatus(status: string) {
	switch (status) {
		case 'pending':
			return WorkflowStatus.PENDING;
		case 'running':
			return WorkflowStatus.RUNNING;
		case 'success':
			return WorkflowStatus.SUCCEEDED;
		case 'failed':
			return WorkflowStatus.FAILED;
		case 'error':
			return WorkflowStatus.ERROR;
		case 'skipped':
			return WorkflowStatus.SKIPPED;
		default:
			return status;
	}
}
