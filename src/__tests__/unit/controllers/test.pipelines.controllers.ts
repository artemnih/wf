/* eslint-disable @typescript-eslint/no-misused-promises */
import { createStubInstance, expect, StubbedInstanceWithSinonAccessor } from '@loopback/testlab';
import { PipelineRepository } from '../../../repositories';
import { PipelineController } from '../../../controllers';
import { Pipeline } from '../../../models';

describe('Pipeline Controller', () => {
  let repository: StubbedInstanceWithSinonAccessor<PipelineRepository>;
  beforeEach(givenStubbedRepository);
  describe('create Pipeline()()', () => {
    it('Create an echo pipeline', async () => {
      const controller = new PipelineController(repository);

      repository.stubs.create.resolves(new Pipeline());
      const plugin = await controller.create(new Pipeline());
      expect(plugin).to.be.eql(new Pipeline());
    });
    it('Delete a pipeline', async () => {
      const controller = new PipelineController(repository);

      repository.stubs.deleteById.resolves();
      try {
        await controller.deleteById('test');
        expect(true).to.be.eql(true);
      } catch {
        expect(false).to.be.eql(true);
      }
    });
    it('Get pipeline by id', async () => {
      const controller = new PipelineController(repository);
      repository.stubs.findById.resolves(new Pipeline({ id: 'hello', title: 'hello' }));
      const plugins = await controller.findById('hello');
      expect(plugins).to.be.eql(new Pipeline({ title: 'hello', id: 'hello' }));
    });
    it('Get Pipelines', async () => {
      const controller = new PipelineController(repository);
      repository.stubs.find.resolves([new Pipeline(), new Pipeline()]);
      const plugins = await controller.find();
      expect(plugins).to.be.eql([new Pipeline(), new Pipeline()]);
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(PipelineRepository);
  }
});
