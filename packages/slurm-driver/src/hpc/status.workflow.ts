import { HpcCli, JobHPC, SlurmCli } from '.';
export function statusOfJobs(id: string, hpcCli: HpcCli = new SlurmCli()): JobHPC[] {
	const jobNames = hpcCli.jobNamesFromWorkflow(id);
	const statusArray: JobHPC[] = [];
	jobNames.forEach(element => {
		statusArray.push(hpcCli.statusOfJob(element));
	});
	return statusArray;
}
