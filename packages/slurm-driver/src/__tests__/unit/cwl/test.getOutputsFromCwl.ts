import { getOutputsFromCwl, OutputDict } from '../../../cwl';
import { expect } from '@loopback/testlab';
import { readFileSync } from 'fs';
import { CwlWorkflowTemplate } from '../../../types';

describe('OutputsFromCwl', () => {
	it('empty outputs', () => {
		expect(
			getOutputsFromCwl(
				'noFile',
				'none',
				-1,
				(_file: string) => {
					return {
						cwlVersion: 'v1.0',
						class: 'CommandLineTool',
						id: '',
						steps: {},
						requirements: {},
						inputs: {},
						outputs: {},
					};
				},
				(_file: string) => {
					return {};
				},
			),
		).to.be.eql({});
	});

	it('echo-simple', () => {
		expect(
			getOutputsFromCwl(
				'noFile',
				'echo',
				-1,
				(file: string) => {
					return JSON.parse(
						readFileSync('src/__tests__/data/doubles/6171ac4137b0b158411138e4-workflow.cwl', 'utf8'),
					) as CwlWorkflowTemplate;
				},
				(file: string) => {
					return JSON.parse(readFileSync('src/__tests__/data/doubles/6171ac4137b0b158411138e4.out.json', 'utf8')) as OutputDict;
				},
			),
		).to.be.eql({
			echoErr: '/Users/dummy/echo.err',
			echoOut: '/Users/dummy/echo.out',
		});
	});
	it('montage-recycle', () => {
		const workflowHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/montage-recycle-workflow.cwl', 'utf8')) as CwlWorkflowTemplate;
		};
		const outputHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/montage-recycle.out.json', 'utf8')) as OutputDict;
		};

		expect(getOutputsFromCwl('noFile', 'montage', -1, workflowHandler, outputHandler)).to.be.eql({
			montageStdOut: '/tmp/cwl/a3a583e4bff1eb90860678aed943dab9f49b4fce',
			montageStdErr: '/tmp/cwl/9d552c97f50001f6d2f1823f0362afaa6b61c4f7',
			montageoutDir: '/tmp/cwl/montage',
		});
		expect(getOutputsFromCwl('noFile', 'recycle', -1, workflowHandler, outputHandler)).to.be.eql({
			recycleStdErr: '/tmp/cwl/8d47b387bfbd9e5bfbb4b2debdba4d1160d9151e',
			recycleStdOut: '/tmp/cwl/d21f2fcffd7fc610353d639d199e53cf115e6fc4',
			recycleoutDir: '/tmp/cwl/recycle',
		});
	});
	it('zarr-format', () => {
		const workflowHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/scatter-format-workflow.cwl', 'utf8')) as CwlWorkflowTemplate;
		};
		const parameterHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/scatter-format.out.json', 'utf8')) as OutputDict;
		};

		expect(getOutputsFromCwl('noFile', 'ome2zarr', 0, workflowHandler, parameterHandler)).to.be.eql({
			ome2zarrStdErr: '/tmp/cwl/2153f584eef80162f2a6114118d3fb22d61903fa',
			ome2zarrStdOut: '/tmp/cwl/861070c57c74f203ad27a6a8f4234bae611749b1',
			ome2zarroutDir: '/tmp/dummy',
		}); // expect(
		expect(getOutputsFromCwl('noFile', 'ome2zarr', 1, workflowHandler, parameterHandler)).to.be.eql({
			ome2zarrStdErr: '/tmp/cwl/2153f584eef80162f2a6114118d3fb22d61903fa_2',
			ome2zarrStdOut: '/tmp/cwl/861070c57c74f203ad27a6a8f4234bae611749b1_2',
			ome2zarroutDir: '/tmp/dummy',
		});
	});
	it('Output While Running', () => {
		const workflowHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter-compute.cwl', 'utf8')) as CwlWorkflowTemplate;
		};
		const parameterHandler = (file: string) => {
			return {} as OutputDict;
		};

		expect(getOutputsFromCwl('noFile', 'ome2zarr', 0, workflowHandler, parameterHandler)).to.be.eql({
			ome2zarrStdErr: '/tmp/cwl/noFile-logs/ome2zarr',
			ome2zarrStdOut: '/tmp/cwl/noFile-logs/ome2zarr',
			ome2zarroutDir: '',
		}); // expect(
		expect(getOutputsFromCwl('noFile', 'ome2zarr', 1, workflowHandler, parameterHandler)).to.be.eql({
			ome2zarrStdErr: '/tmp/cwl/noFile-logs/ome2zarr_2',
			ome2zarrStdOut: '/tmp/cwl/noFile-logs/ome2zarr_2',
			ome2zarroutDir: '',
		});
	});
	it('Dynamic Scatter', () => {
		const workflowHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter-compute.cwl', 'utf8')) as CwlWorkflowTemplate;
		};
		const parameterHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter.out.json', 'utf8')) as OutputDict;
		};

		expect(getOutputsFromCwl('noFile', 'patternGenerator', 0, workflowHandler, parameterHandler)).to.be.eql({
			filePatterns: ['x24_y16_wx2_wy1_c{c}.ome.tif', 'x24_y16_wx2_wy2_c{c}.ome.tif'],
		});
	});
});
