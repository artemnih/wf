import { getInputsFromCwl, OutputDict } from '../../../cwl';
import { expect } from '@loopback/testlab';
import { readFileSync } from 'fs';
import { CwlWorkflowTemplate } from '../../../types';

describe('InputsFromCwl', () => {
	it('empty inputs', () => {
		expect(
			getInputsFromCwl(
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
			getInputsFromCwl(
				'noFile',
				'echo',
				-1,
				(_file: string) => {
					return JSON.parse(
						readFileSync('src/__tests__/data/doubles/6171ac4137b0b158411138e4-workflow.cwl', 'utf8'),
					) as CwlWorkflowTemplate;
				},
				(_file: string) => {
					return JSON.parse(readFileSync('src/__tests__/data/doubles/6171ac4137b0b158411138e4-params.json', 'utf8')) as Record<
						string,
						string
					>;
				},
			),
		).to.be.eql({
			message: 'hello kevin',
		});
	});
	it('montage-recycle', () => {
		const workflowHandler = (_file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/montage-recycle-workflow.cwl', 'utf8')) as CwlWorkflowTemplate;
		};
		const parameterHandler = (_file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/montage-recycle-params.json', 'utf8')) as Record<string, string>;
		};
		const outputHandler = (_file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/montage-recycle.out.json', 'utf8')) as OutputDict;
		};

		expect(getInputsFromCwl('noFile', 'montage', -1, workflowHandler, parameterHandler, outputHandler)).to.be.eql({
			filePattern: 'p00_x{xx}_y{yy}_r{rr}_c01.ome.zarr',
			inpDir: '/home/ec2-user/cwl/montage-recycle/data',
			layout: 'r,xy',
			imageSpacing: 10,
			gridSpacing: 20,
			outDir: 'montage',
		});
		expect(getInputsFromCwl('noFile', 'recycle', -1, workflowHandler, parameterHandler, outputHandler)).to.be.eql({
			groupBy: 'r',
			collectionRegex: 'p{tt}_x{xx}_y{yy}_r{rr}_c{cc}.ome.zarr',
			stitchRegex: 'p{tt}_x{xx}_y{yy}_r{rr}_c{cc}.ome.zarr',
			stitchDir: '/tmp/cwl/montage',
			collectionDir: '/home/ec2-user/cwl/montage-recycle/data',
			outDir: 'recycle',
		});
	});
	it('zarr-format', () => {
		const workflowHandler = (_file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/scatter-format-workflow.cwl', 'utf8')) as CwlWorkflowTemplate;
		};
		const parameterHandler = (_file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/scatter-format-params.json', 'utf8')) as Record<string, string>;
		};

		expect(getInputsFromCwl('noFile', 'ome2zarr', 0, workflowHandler, parameterHandler)).to.be.eql({
			filePattern: 'x24_y16_wx2_wy1_c{c}.ome.tif',
			inpDir: '/home/ec2-user/cwl/zarr-to-ome/data',
			outDir: 'zarr',
		});
		expect(getInputsFromCwl('noFile', 'ome2zarr', 1, workflowHandler, parameterHandler)).to.be.eql({
			filePattern: 'x24_y16_wx2_wy2_c{c}.ome.tif',
			inpDir: '/home/ec2-user/cwl/zarr-to-ome/data',
			outDir: 'zarr',
		});
	});
	it('Dynamic Scatter', () => {
		const workflowHandler = (file: string) => {
			return JSON.parse(
				readFileSync('src/__tests__/data/doubles/dynamic-scatter-operator-workflow.cwl', 'utf8'),
			) as CwlWorkflowTemplate;
		};
		const parameterHandler = (file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter-params.json', 'utf8')) as Record<string, string>;
		};
		const outputHandler = (_file: string) => {
			return JSON.parse(readFileSync('src/__tests__/data/doubles/dynamic-scatter.out.json', 'utf8')) as OutputDict;
		};

		expect(getInputsFromCwl('noFile', 'patternGenerator', -1, workflowHandler, parameterHandler, outputHandler)).to.be.eql({
			chunkSize: 2,
			inpDir: '/home/kevin.hannon/data/tiff-converter',
			outDir: 'zarr',
			pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
		});
		expect(getInputsFromCwl('noFile', 'ome2zarr', 0, workflowHandler, parameterHandler, outputHandler)).to.be.eql({
			filePattern: 'dynamic scatter not supported',
			inpDir: '/home/kevin.hannon/data/tiff-converter',
			outDir: 'zarr',
		});
		expect(getInputsFromCwl('noFile', 'ome2zarr', 1, workflowHandler, parameterHandler, outputHandler)).to.be.eql({
			filePattern: 'dynamic scatter not supported',
			inpDir: '/home/kevin.hannon/data/tiff-converter',
			outDir: 'zarr',
		});
	});
});
