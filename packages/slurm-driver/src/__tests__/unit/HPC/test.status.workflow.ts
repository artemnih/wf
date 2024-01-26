import { statusOfJobs } from '../../../hpc';
import { expect } from '@loopback/testlab';

import { TestHPCCli } from '../../fixtures/mock.hpc.cli';
describe('Status Workflow', () => {
	it('no found found', () => {
		const testHpc = new TestHPCCli();
		testHpc.jobNamesFromWorkflow = (id: string) => {
			return [];
		};

		expect(statusOfJobs('noJob', testHpc)).to.be.eql([]);
	});
	it('happy path status', () => {
		expect(statusOfJobs('test', new TestHPCCli())).to.be.eql([
			{
				dateCreated: '0.0000',
				dateFinished: '0.0001',
				driver: 'slurm',
				inputs: {},
				jobId: 'toil_job_2_test.echo',
				jobName: 'echo',
				outputs: {},
				status: 2,
				workflowId: 'test',
			},
		]);
	});
});
