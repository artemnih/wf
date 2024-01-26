import { replaceKeyName } from '../../../cwl/replace.key.name';
import { expect } from '@loopback/testlab';

describe('Replace namespace and schema', () => {
	it('happy path', () => {
		const testObj = { name: 'hello', namespaces: {}, schemas: 'blah2' };
		expect(replaceKeyName(testObj as Record<string, unknown>)).to.be.eql({
			name: 'hello',
			$namespaces: {},
			$schemas: 'blah2',
		});
	});
});
