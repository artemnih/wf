import {expect} from '@loopback/testlab';
import {readFileSync} from 'fs';
import {getTargetFromJobs, Target} from '../../services';
import {MinimalJob} from '../../types';

describe('Test argo status api', () => {
  it('Test target function on logs', () => {
    const jobs = JSON.parse(
      readFileSync('src/__tests__/data/doubles/test-jobs.json', 'utf8'),
    ) as MinimalJob[];
    expect(getTargetFromJobs(jobs, Target.logs)).to.be.eql({
      montageStdOut: 'See Argo UI',
      montageStdErr: 'See Argo UI',
      recycleStdErr: 'See Argo UI',
      recycleStdOut: 'See Argo UI',
    });
  });
  it('Test target function on outputs', () => {
    const jobs = JSON.parse(
      readFileSync('src/__tests__/data/doubles/test-jobs.json', 'utf8'),
    ) as MinimalJob[];
    expect(getTargetFromJobs(jobs, Target.outputs)).to.be.eql({
      montageoutDir: '/data/outputs/montage',
      recycleoutDir: '/data/outputs/recycle',
    });
  });
});
