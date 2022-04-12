/* eslint-disable @typescript-eslint/no-misused-promises */
import { createStubInstance, expect, StubbedInstanceWithSinonAccessor } from '@loopback/testlab';
import { PluginRepository } from '../../../repositories';
import { PluginController } from '../../../controllers';
import { Plugin } from '../../../models';

describe('Plugin Controller', () => {
  let repository: StubbedInstanceWithSinonAccessor<PluginRepository>;
  beforeEach(givenStubbedRepository);
  describe('create Plugin()', () => {
    it('retrieves a CwlScript', async () => {
      const controller = new PluginController(repository);

      const script = {
        name: 'hello',
        version: '1.0.0',
        cwlScript: {},
      };
      const scriptModel = new Plugin(script);
      repository.stubs.create.resolves(scriptModel);
      repository.stubs.checkIfPluginExists.resolves(false);

      const details = await controller.create(scriptModel);
      expect(details).to.be.eql(scriptModel);
    });
    it('mock an existing plugin', async () => {
      const controller = new PluginController(repository);

      const script = {
        name: 'hello',
        version: '1.0.0',
        cwlScript: {},
      };
      const scriptModel = new Plugin(script);
      repository.stubs.create.resolves(scriptModel);
      repository.stubs.checkIfPluginExists.resolves(true);

      try {
        await controller.create(scriptModel);
      } catch (error) {
        expect(error.message).to.be.eql('A Plugin with name hello and version 1.0.0 already exists.');
      }
    });
    it('Create an echo tool', async () => {
      const controller = new PluginController(repository);

      const echoPlugin = {
        title: 'echo',
        name: 'echo',
        description: 'Advanced montaging plugin.',
        baseCommand: ['echo'],
        version: '1.0.0',
        author: 'Kevin Hannon',
        institution: 'National Center for Advancing Translational Sciences, National Institutes of Health',
        containerId: 'busybox',
        pluginHardwareRequirements: {
          gpu: '0',
        },
        inputs: [
          {
            name: 'message',
            type: '1',
            label: 'Parameter to pass to echo',
            required: true,
          },
        ],
        outputs: [],
        ui: [],
      };
      repository.stubs.create.resolves(new Plugin(echoPlugin));
      repository.stubs.checkIfPluginExists.resolves(false);
      const plugin = await controller.create(new Plugin(echoPlugin));
      expect(plugin).to.be.eql(new Plugin(echoPlugin));
    });
    it('Delete a tool', async () => {
      const controller = new PluginController(repository);

      repository.stubs.deleteById.resolves();
      try {
        await controller.deleteById('test');
        expect(true).to.be.eql(true);
      } catch {
        expect(false).to.be.eql(true);
      }
    });
    it('Get tool by id', async () => {
      const controller = new PluginController(repository);
      repository.stubs.findById.resolves(new Plugin({ id: 'hello', title: 'hello' }));
      const plugins = await controller.findById('hello');
      expect(plugins).to.be.eql(new Plugin({ title: 'hello', id: 'hello' }));
    });
    it('Get tools', async () => {
      const controller = new PluginController(repository);
      repository.stubs.find.resolves([new Plugin(), new Plugin()]);
      const plugins = await controller.find();
      expect(plugins).to.be.eql([new Plugin(), new Plugin()]);
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(PluginRepository);
  }
});
