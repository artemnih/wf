import {expect} from '@loopback/testlab';
import {jobFromHpc, Status} from '../../../hpc';
describe('Status From HPC', () => {
  function expectedFunction(status: Status) {
    return {
      jobId: 'toil_job_8_subworkflow.echo',
      jobName: 'echo',
      status,
      dateCreated: '2022-01-03T18:50:09',
      dateFinished: '2022-01-03T19:06:53',
      driver: 'slurm',
      workflowId: 'subworkflow',
      inputs: {},
      outputs: {},
    };
  }
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

  it('running', () => {
    const sacctBuf = `,2022-01-03T18:50:09,2022-01-03T19:06:53,RUNNING\n
    2022-01-03T18:50:09,2022-01-03T19:06:53,RUNNING`;
    const val = jobFromHpc(
      'toil_job_8_subworkflow.echo',
      sacctBuf,
      mockedGetInputsFromCwl,
      mockedGetOutputsFromCwl,
    );
    expect(val).to.be.eql(expectedFunction(Status.RUNNING));
  });
  it('error', () => {
    const sacctBuf = `,2022-01-03T18:50:09,2022-01-03T19:06:53,ERROR`;
    const val = jobFromHpc(
      'toil_job_8_subworkflow.echo',
      sacctBuf,
      mockedGetInputsFromCwl,
      mockedGetOutputsFromCwl,
    );
    expect(val).to.be.eql(expectedFunction(Status.ERROR));
  });
  it('pending', () => {
    const sacctBuf = `,2022-01-03T18:50:09,2022-01-03T19:06:53,PENDING`;
    const val = jobFromHpc(
      'toil_job_8_subworkflow.echo',
      sacctBuf,
      mockedGetInputsFromCwl,
      mockedGetOutputsFromCwl,
    );
    expect(val).to.be.eql(expectedFunction(Status.PENDING));
  });
  it('cancelled', () => {
    const sacctBuf = `,2022-01-03T18:50:09,2022-01-03T19:06:53,CANCELLED`;
    const val = jobFromHpc(
      'toil_job_8_subworkflow.echo',
      sacctBuf,
      mockedGetInputsFromCwl,
      mockedGetOutputsFromCwl,
    );
    expect(val).to.be.eql(expectedFunction(Status.CANCELLED));
  });
  it('completed', () => {
    const sacctBuf = `,2022-01-03T18:50:09,2022-01-03T19:06:53,COMPLETED`;
    const val = jobFromHpc(
      'toil_job_8_subworkflow.echo',
      sacctBuf,
      mockedGetInputsFromCwl,
      mockedGetOutputsFromCwl,
    );
    expect(val).to.be.eql(expectedFunction(Status.COMPLETED));
  });
});
