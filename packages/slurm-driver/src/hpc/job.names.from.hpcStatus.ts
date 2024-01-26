export function jobNamesFromHPCStatus(hpcStatus: string, jobName: string): string[] {
	const exp = `toil_job_\\d?_${jobName}\\S*`;
	const regExp = new RegExp(exp, 'gim');

	const returnString: string[] = [];
	let m;
	while ((m = regExp.exec(hpcStatus)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regExp.lastIndex) {
			regExp.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			returnString.push(match);
		});
	}
	return returnString;
}
