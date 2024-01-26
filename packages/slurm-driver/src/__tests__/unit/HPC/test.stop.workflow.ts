import { stopWorkflow } from '../../../hpc';

import { TestHPCCli } from '../../fixtures/mock.hpc.cli';
describe('Stop Workflow', () => {
	it('stop happy', () => {
		stopWorkflow('test', new TestHPCCli(), (id: string) => {});
	});
});
