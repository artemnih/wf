import { getWorkflowLogs } from '../../../cwl';
import { expect } from '@loopback/testlab';

describe('Get logs of Jobs from outfile', () => {
	it('montage-recycle', () => {
		const jobs = {
			montageOut: { location: 'file://mOut' },
			montageLogs: { location: 'file://mStdOut.out' },
			recycleOut: { location: 'file://rOut' },
			recycleLogs: { location: 'file://rStdOut.out' },
		};
		const jobLogs = getWorkflowLogs(jobs);
		expect(jobLogs).to.be.eql({
			montageLogs: 'mStdOut.out',
			recycleLogs: 'rStdOut.out',
		});
	});
	it('scatter-ome2zarr', () => {
		const jobs = {
			zarrOut: [{ location: 'file://zarr' }, { location: 'file://zarr' }],
			zarrLogs: [{ location: 'file://zarr.log' }, { location: 'file://zarr_2.log' }],
		};
		const jobOutput = getWorkflowLogs(jobs);
		expect(jobOutput).to.be.eql({
			zarrLogs: ['zarr.log', 'zarr_2.log'],
		});
	});
});
