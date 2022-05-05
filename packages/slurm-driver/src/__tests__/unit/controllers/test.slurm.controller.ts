/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  createStubInstance,
  expect,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {SlurmRepository} from '../../../repositories';
import {SlurmController} from '../../../controllers';
import {Slurm} from '../../../models';
import {TestHPCCli} from '../../fixtures/mock.hpc.cli';

describe('Slurm Controller', () => {
  let repository: StubbedInstanceWithSinonAccessor<SlurmRepository>;
  beforeEach(givenStubbedRepository);
  it('submit a workflow', async () => {
    const controller = new SlurmController(repository);

    repository.stubs.compute.resolves();
    try {
      await controller.create(new Slurm());
    } catch {
      expect(true).to.be.false();
    }
  });
  it('stop a workflow', async () => {
    const controller = new SlurmController(repository);

    repository.stubs.stopWorkflow.resolves();
    try {
      await controller.stopWorkflow('test');
    } catch {
      expect(false).to.be.true();
    }
  });
  it('getWorkflowJobs with empty object', async () => {
    const controller = new SlurmController(repository);

    repository.stubs.getWorkflowJobs.resolves({});
    const test = await controller.getWorkflowJobs('test', new TestHPCCli());
    expect(test).to.be.eql({});
  });
  it('getWorkflowStatus', async () => {
    const controller = new SlurmController(repository);
    repository.stubs.getWorkflowStatus.resolves({
      status: 'COMPLETED',
      dateCreated: 'start',
      dateFinished: 'end',
    });
    const status = await controller.getWorkflowStatus('test');
    expect(status).to.be.eql({
      status: 'COMPLETED',
      dateCreated: 'start',
      dateFinished: 'end',
    });
  });
  function givenStubbedRepository() {
    repository = createStubInstance(SlurmRepository);
  }
});
