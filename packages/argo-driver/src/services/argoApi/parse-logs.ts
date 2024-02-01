import { ArgoLogRecord } from '../../types';

export function parseLogs(rawLogs: string) {
	const lines = (rawLogs.split('\n') as string[]).filter(s => !!s.trim());
	const jsonLines = lines.map(line => JSON.parse(line) as ArgoLogRecord);
	const content = jsonLines.map(line => line.result.content).join('\n');
	return content;
}
