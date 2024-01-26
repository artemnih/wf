import { spawnSync } from 'child_process';
import { jobFromHpc, jobNamesFromHPCStatus } from '../../../hpc';
import { HpcCli, Status, JobHPC } from '../../../hpc/hpc.cli';
import { expect } from '@loopback/testlab';

const mockedGetInputsFromCwl = (
	workflowId: string,
	jobName: string,
	scatterIndex = -1,
	workflowHandler = (file: string) => {
		return {};
	},
	parametersHandler = (file: string) => {
		return {};
	},
) => {
	return {};
};
const mockedGetOutputsFromCwl = (
	workflowId: string,
	jobName: string,
	scatterIndex = -1,
	workflowHandler = (file: string) => {
		return {};
	},
	parametersHandler = (file: string) => {
		return {};
	},
) => {
	return {};
};

// This is just a mock test of the slurm cli.
// Keep this with parity with slurm but mock about the slurm cli ie use echo.
export class TestHPCCli implements HpcCli {
	kill(id: string): void {
		spawnSync('echo', [id]);
	}
	statusOfJob(id: string): JobHPC {
		const jobStatus = spawnSync('echo', [',0.0000,0.0001,RUNNING']);
		return jobFromHpc(id, jobStatus.output.toString().replace(',', ''), mockedGetInputsFromCwl, mockedGetOutputsFromCwl);
	}
	jobNamesFromWorkflow(id: string): string[] {
		const jobNames = spawnSync('echo', [`toil_job_2_${id}.echo`]);
		return jobNamesFromHPCStatus(jobNames.output.toString(), id);
	}
}
describe('TestHPCCli', () => {
	const hpcMock = new TestHPCCli();
	it('happy path kill', () => {
		hpcMock.kill('hello');
	});
	it('jobNamesFromWorkflow', () => {
		expect(hpcMock.jobNamesFromWorkflow('hello')).to.be.eql(['toil_job_2_hello.echo']);
	});
	it('statusOfJob Happy', () => {
		expect(hpcMock.statusOfJob('toil_job_2_workflow.hello')).to.be.eql({
			jobId: 'toil_job_2_workflow.hello',
			jobName: 'hello',
			driver: 'slurm',
			inputs: {},
			outputs: {},
			workflowId: 'workflow',
			status: Status.RUNNING,
			dateCreated: '0.0000',
			dateFinished: '0.0001',
		});
	});
});
