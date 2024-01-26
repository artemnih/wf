const getStatusMap = () => {
	const statusMap = new Map();
	statusMap.set('0', 'ERROR');
	statusMap.set('1', 'COMPLETED');
	statusMap.set('2', 'RUNNING');
	statusMap.set('3', 'PENDING');
	statusMap.set('4', 'CANCELLED');
	return statusMap;
};
export function convertStatusToString(status: number): string {
	const statusMap = getStatusMap();
	if (statusMap.has(status.toString())) return statusMap.get(status.toString());
	return 'NOTFOUND';
}
