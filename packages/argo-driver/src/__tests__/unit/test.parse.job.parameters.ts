import { parseJobParameters } from '../../services/CWLToArgo';
import { expect } from '@loopback/testlab';

describe('Parse Job Parameters', () => {
	it('Parameters with 1 object', () => {
		const expected = [{ name: 'hello1', value: 'hey' }];
		const cwlJobInputs = { hello1: 'hey' };
		const returnValue = parseJobParameters(cwlJobInputs);
		expect(returnValue).to.be.eql(expected);
	});
	it('Parameters with 2 objects', () => {
		const expected = [
			{ name: 'hello1', value: 'hey' },
			{ name: 'hello2', value: 'kevin' },
		];
		const cwlJobInputs = { hello1: 'hey', hello2: 'kevin' };
		const returnValue = parseJobParameters(cwlJobInputs);
		expect(returnValue).to.be.eql(expected);
	});
	it('Parameters with 0 object', () => {
		const expected: never[] = [];
		const cwlJobInputs = {};
		const returnValue = parseJobParameters(cwlJobInputs);
		expect(returnValue).to.be.eql(expected);
	});
	it('WIPP Parameters', () => {
		const WIPPParams = {
			montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
			montageInpDir: {
				class: 'Directory',
				path: 'data/images/',
			},
			montageLayout: ['r', 'xy'],
			montageImageSpacing: 10,
			assembleTimeSliceNaming: false,
			assembleOutDir: {
				class: 'Directory',
				path: 'data/assemble',
			},
		};
		const expected = [
			{
				name: 'montageFilePattern',
				value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
			},
			{ name: 'montageInpDir', value: 'data/images/' },
			{ name: 'montageLayout', value: ['r', 'xy'] },
			{ name: 'montageImageSpacing', value: 10 },
			{ name: 'assembleTimeSliceNaming', value: false },
			{ name: 'assembleOutDir', value: 'data/assemble' },
		];
		const returnValue = parseJobParameters(WIPPParams);
		expect(returnValue).to.be.eql(expected);
	});
});
