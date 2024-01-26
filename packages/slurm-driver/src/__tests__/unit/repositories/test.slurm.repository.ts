/* eslint-disable @typescript-eslint/no-misused-promises */
import { expect } from '@loopback/testlab';
import { SlurmRepository } from '../../../repositories';
import { TestHPCCli } from '../../fixtures/mock.hpc.cli';

describe('Slurm Repository', () => {
	it('stop workflow', async () => {
		const slurmRepo = new SlurmRepository();
		try {
			await slurmRepo.stopWorkflow('test', new TestHPCCli(), (id: string) => {});
		} catch {
			expect(false).to.be.true();
		}
	});
	it('getWorkflow Jobs entry', async () => {
		const slurmRepo = new SlurmRepository();
		const object = await slurmRepo.getWorkflowJobs('test', new TestHPCCli());
		expect(object).to.be.eql([
			{
				jobId: 'toil_job_2_test.echo',
				driver: 'slurm',
				status: 'RUNNING',
				jobName: 'echo',
				dateCreated: '0.0000',
				dateFinished: '0.0001',
				workflowId: 'test',
				inputs: {},
				outputs: {},
			},
		]);
	});
	it('getWorkflow jobs no jobs', async () => {
		const slurmRepo = new SlurmRepository();
		const testHpc = new TestHPCCli();
		testHpc.jobNamesFromWorkflow = (id: string) => {
			return [];
		};
		const object = await slurmRepo.getWorkflowJobs('test', testHpc);
		expect(object).to.be.eql({});
	});
	it('getWorkflowStatus', async () => {
		const slurmRepo = new SlurmRepository();
		const status = await slurmRepo.getWorkflowStatus('src/__tests__/data/doubles/test.status.json');
		expect(status).to.be.eql({
			status: 'FINISHED',
			dateCreated: 'start',
			dateFinished: 'end',
		});
	});
});
