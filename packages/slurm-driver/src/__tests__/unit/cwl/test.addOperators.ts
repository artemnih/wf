import { expect } from '@loopback/testlab';
import { readFileSync } from 'fs';
import { addOperators } from '../../../cwl';
import { CwlWorkflowTemplate } from '../../../types';

describe('Add Operator', () => {
	it('Add operator no opp', () => {
		const workflow = JSON.parse(readFileSync('src/__tests__/data/doubles/montage-recycle-workflow.cwl', 'utf8')) as CwlWorkflowTemplate;
		expect(addOperators(workflow, '', '', '', () => {})).to.be.eql(workflow);
	});
	it('Add operator scatter but not dynamic', () => {
		const workflow = JSON.parse(readFileSync('src/__tests__/data/doubles/scatter-format-workflow.cwl', 'utf8')) as CwlWorkflowTemplate;
		expect(addOperators(workflow, '', '', '', () => {})).to.be.eql(workflow);
	});
	it('Add operator dynamic scatter', () => {
		const workflow = JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter-compute.cwl', 'utf8')) as CwlWorkflowTemplate;
		expect(
			addOperators(workflow, 'src/operators/cwl-filepattern-plugin.cwl', 'src/__tests__/data/doubles', 'test.cwl', () => {}),
		).to.be.eql(JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter-operator-workflow.cwl', 'utf8')));
	});
	it('Add operator dynamic scatter two steps', () => {
		const workflow = JSON.parse(
			readFileSync('src/__tests__/data/doubles/dynamic-scatter-compute-2.cwl', 'utf8'),
		) as CwlWorkflowTemplate;
		expect(
			addOperators(workflow, 'src/operators/cwl-filepattern-plugin.cwl', 'src/__tests__/data/doubles', 'test.cwl', () => {}),
		).to.be.eql(JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter-operator-workflow-2.cwl', 'utf8')));
	});
});
