import { WorkflowStatusPayload } from '@polusai/compute-common';
import { translateCwlStatus } from './translate-status';

export function statusFromLogs(log: string): WorkflowStatusPayload {
	// split the log into records using regex positive lookahead by timestamp [time: 2024-02-09T17:23:54.581Z]
	const rowRecords = log.split(/(?=\[time: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\])/);

	// extract the timestamp and message from each record
	const records = rowRecords.map(r => {
		var time = r.match(/\[time: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/);
		var message = r.replace(time[0], '');
		return { time: time[1], message };
	});

	// workflow start time - find the first record that contains [workflow ] start and not [workflow ] starting step
	const workflowStart =
		records.find(r => r.message.includes('[workflow ] start') && !r.message.includes('[workflow ] starting step')).time || '';

	// workflow end time - find the last record that contains [workflow ] completed success
	const workflowEnd = records.reverse().find(r => r.message.includes('[workflow ] completed success')).time || '';

	// determine status from the message 'Final process status is success'
	const status =
		records.find(r => r.message.includes('Final process status is success')).message.match(/Final process status is (.+)/)[1] ||
		'error';

	// get each step id, start time, end time, and status
	// find all records that contains [workflow ] starting step and extract the step name and start time
	const rowJobs = records.filter(r => r.message.includes('[workflow ] starting step'));
	const jobs = rowJobs.map(step => {
		const id = step.message.match(/\[workflow \] starting step (.+)/)[1];
		const startedAt = step.time;
		const finishedAt = records.find(r => r.message.includes(`[step ${id}] completed success`)).time || '';
		const statusRow =
			records.find(r => r.message.includes(`[step ${id}] completed success`)).message.match(/\[step .+\] completed (.+)/)[1] ||
			'pending';
		const jobStatus = translateCwlStatus(statusRow);
		return { id, status: jobStatus, startedAt, finishedAt };
	});

	const payload = {
		status: translateCwlStatus(status),
		startedAt: workflowStart,
		finishedAt: workflowEnd,
		jobs: jobs,
	} as WorkflowStatusPayload;

	return payload;
}
