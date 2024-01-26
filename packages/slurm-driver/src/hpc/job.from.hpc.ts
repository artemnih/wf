import { OutputDict, readCwlOutput, readWorkflow, readParameters } from '../cwl';
import { JobHPC, Status } from './hpc.cli';
import { CwlWorkflowTemplate, FileOrDirectoryInput } from '../types';

type InputfromCwlShape = (
	workflowId: string,
	jobName: string,
	scatterIndex: number,
	workflowHandler: (id: string) => CwlWorkflowTemplate,
	parameterHandler: (id: string) => Record<string, string | FileOrDirectoryInput | string[]>,
	outputs: (id: string) => OutputDict,
) => Record<string, string>;

type OutputsFromCwlShape = (
	workflowId: string,
	jobName: string,
	scatterIndex: number,
	workflowHandler: (id: string) => CwlWorkflowTemplate,
	outputs: (id: string) => OutputDict,
) => Record<string, string | string[] | boolean | number>;
export function jobFromHpc(
	jobId: string,
	statusStdOut: string,
	diGetInputsFromCwl: InputfromCwlShape,
	diGetOutputsFromCwl: OutputsFromCwlShape,
): JobHPC {
	const driver = 'slurm';
	const jobNameArray = jobId.split('.');
	let scatterIndex = parseInt(jobNameArray[1]);
	scatterIndex = isNaN(scatterIndex) ? 0 : scatterIndex;
	const jobName = jobNameArray[jobNameArray.length - 1];
	//Format for name toil_job_8_subworkflow
	const workflowId = jobNameArray[0].split('_')[3];
	let status: Status = Status.NOTFOUND;
	const statusArray = statusStdOut.split(',', 4);
	const dateCreated = statusArray[1],
		dateFinished = statusArray[2];
	if (statusArray[3].startsWith('RUNNING')) status = Status.RUNNING;
	if (statusArray[3].startsWith('PENDING')) status = Status.PENDING;
	if (statusArray[3].startsWith('COMPLETED')) status = Status.COMPLETED;
	if (statusArray[3].startsWith('ERROR')) status = Status.ERROR;
	if (statusArray[3].startsWith('CANCELLED')) status = Status.CANCELLED;
	if (status === Status.NOTFOUND) console.error('Could not find correct status from HPC-Cli');
	return {
		jobId,
		status,
		jobName,
		workflowId,
		driver,
		dateCreated,
		dateFinished,
		inputs: diGetInputsFromCwl(
			workflowId,
			jobName,
			scatterIndex,
			() => readWorkflow(workflowId),
			() => readParameters(workflowId),
			() => readCwlOutput(workflowId),
		),
		outputs: diGetOutputsFromCwl(
			workflowId,
			jobName,
			scatterIndex,
			() => readWorkflow(workflowId),
			() => readCwlOutput(workflowId),
		),
	};
}
