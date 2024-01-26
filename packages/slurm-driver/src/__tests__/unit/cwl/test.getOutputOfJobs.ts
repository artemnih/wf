import { getOutputOfJobs } from '../../../cwl';
import { expect } from '@loopback/testlab';

describe('Get outputs of Jobs from outfile', () => {
	it('montage-recycle', () => {
		const jobs = {
			montageOut: { location: 'file://mOut' },
			montageLogs: { location: 'file://mStdOut.out' },
			recycleOut: { location: 'file://rOut' },
			recycleLogs: { location: 'file://rStdOut.out' },
		};
		const jobOutput = getOutputOfJobs(jobs);
		expect(jobOutput).to.be.eql({
			montageOut: 'mOut',
			recycleOut: 'rOut',
		});
	});
	it('scatter-ome2zarr', () => {
		const jobs = {
			zarrOut: [{ location: 'file://zarr' }, { location: 'file://zarr' }],
			zarrLogs: [{ location: 'file://zarr.log' }, { location: 'file://zarr_2.log' }],
		};
		const jobOutput = getOutputOfJobs(jobs);
		expect(jobOutput).to.be.eql({
			zarrOut: ['zarr', 'zarr'],
		});
	});
});
