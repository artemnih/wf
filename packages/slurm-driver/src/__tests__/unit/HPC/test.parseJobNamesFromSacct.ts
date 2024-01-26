import { expect } from '@loopback/testlab';
import { readFileSync } from 'fs';
import { jobNamesFromHPCStatus } from '../../../hpc';

describe('Slurm SAcct format parse', () => {
	it('Get job names that match regExp', () => {
		const sacctBuf = readFileSync('src/__tests__/data/doubles/sacct-dummy.txt', 'utf8');
		const val = jobNamesFromHPCStatus(sacctBuf, 'subworkflow');
		expect(val).to.be.eql(['toil_job_8_subworkflow.echo', 'toil_job_9_subworkflow.echo']);
	});
});
