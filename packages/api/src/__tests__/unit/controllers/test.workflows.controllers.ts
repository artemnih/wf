/* eslint-disable @typescript-eslint/no-misused-promises */
import { createStubInstance, expect, StubbedInstanceWithSinonAccessor } from '@loopback/testlab';
import { PipelineRepository, WorkflowRepository } from '../../../repositories';
import { WorkflowController } from '../../../controllers';
import { Workflow } from '../../../models';
import { Request } from '@loopback/rest';

describe('Workflow Controller', () => {
  const req = {headers: {authorization: ''}};
  let workflowRepository: StubbedInstanceWithSinonAccessor<WorkflowRepository>;
  let pipelineRepository: StubbedInstanceWithSinonAccessor<PipelineRepository>;

  beforeEach(givenStubbedRepository);
  it('submit a workflow', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);

    const workflow = {
      driver: 'Argo',
      inputs: { hello: 'string' },
      outputs: {},
      cwlJobInputs: { hello: 'kevin' },
      steps: {
        hello: {
          run: '612cf48ca257602c9f43f7e0',
          in: {
            hello: 'hello',
          },
          out: [],
        },
      },
    };
    const trueWorkflow = new Workflow(workflow);
    workflowRepository.stubs.create.resolves(trueWorkflow);
    //      repository.stubs.submitWorkflowToDriver.resolves(trueWorkflow);
    const details = await controller.create(trueWorkflow);
    expect(details).to.be.eql(trueWorkflow);
  });
  it('Error on workflow with id specified', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);

    const workflow = {
      id: 'test',
      driver: 'Argo',
      inputs: { hello: 'string' },
      outputs: {},
      cwlJobInputs: { hello: 'kevin' },
      steps: {
        hello: {
          run: '612cf48ca257602c9f43f7e0',
          in: {
            hello: 'hello',
          },
          out: [],
        },
      },
    };
    const trueWorkflow = new Workflow(workflow);
    workflowRepository.stubs.create.resolves(trueWorkflow);
    try {
      await controller.create(trueWorkflow);
    } catch (error) {
      expect(error.message).to.be.eql('User specified id field which is not allowed');
    }
  });
  it('Resubmit a workflow', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);

    const trueWorkflow = new Workflow({ id: 'blah' });
    workflowRepository.stubs.resubmitWorkflow.resolves(trueWorkflow);
    workflowRepository.stubs.findById.resolves(new Workflow({ id: 'blah' }));
    workflowRepository.stubs.create.resolves(trueWorkflow);

    const workflow = await controller.resubmitWorkflow('blah');
    expect(workflow).to.be.eql(new Workflow({ id: 'blah' }));
  });
  it('Get workflow by id', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);
    workflowRepository.stubs.findById.resolves(new Workflow({ id: 'hello', title: 'hello' }));
    const plugins = await controller.findById('hello');
    expect(plugins).to.be.eql(new Workflow({ title: 'hello', id: 'hello' }));
  });
  it('Get workflows', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);
    workflowRepository.stubs.find.resolves([new Workflow(), new Workflow()]);
    const plugins = await controller.find();
    expect(plugins).to.be.eql([new Workflow(), new Workflow()]);
  });
  it('Update Workflow by id ', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);
    workflowRepository.stubs.updateById.resolves();
    try {
      await controller.updateById('test', new Workflow());
      expect(true).to.be.true();
    } catch {
      expect(false).to.be.true();
    }
  });
  it('Workflow Status by id', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);
    const workflow = {
      status: 'finished',
      dateCreated: '01/01/2020',
      dateFinished: '02/02/2020',
    };
    workflowRepository.stubs.findById.resolves(new Workflow(workflow));
    workflowRepository.stubs.getWorkflowStatus.resolves({ status: 'finished', dateCreated: '01/01/2020', dateFinished: '02/02/2020' });
    workflowRepository.stubs.updateById.resolves();
    const status = await controller.getWorkflowStatus('test');
    expect(status).to.be.eql({ status: 'finished', dateCreated: '01/01/2020', dateFinished: '02/02/2020' });
  });
  it('Stop Workflow', async () => {
    const controller = new WorkflowController(workflowRepository, req as Request, pipelineRepository);
    const workflow = {
      status: 'running',
    };
    workflowRepository.stubs.findById.resolves(new Workflow(workflow));
    workflowRepository.stubs.stopWorkflow.resolves(new Workflow(workflow));
    workflowRepository.stubs.updateById.resolves();
    try {
      await controller.stopWorkflow('test');
      expect(true).to.be.true();
    } catch {
      expect(false).to.be.true();
    }
  });

  function givenStubbedRepository() {
    workflowRepository = createStubInstance(WorkflowRepository);
    pipelineRepository = createStubInstance(PipelineRepository);
  }
});
