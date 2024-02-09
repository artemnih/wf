export function getSingleJobLogs(log: string, jobId: string): string {
	const rowRecords = log.split(/(?=\[time: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]\:)/);
	const filtered = rowRecords.filter(r => r.includes(`[job ${jobId}]`));
	return filtered.join('');
}
