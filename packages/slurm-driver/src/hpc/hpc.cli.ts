export enum Status {
	ERROR,
	COMPLETED,
	RUNNING,
	PENDING,
	CANCELLED,
	NOTFOUND,
}
export interface JobHPC {
	jobId: string;
	jobName: string;
	driver: string;
	workflowId: string;
	status: Status;
	dateCreated: string;
	dateFinished: string;
	inputs: object;
	outputs: object;
}

export interface HpcCli {
	kill(id: string): void;
	statusOfJob(id: string): JobHPC;
	jobNamesFromWorkflow(id: string): string[];
}
