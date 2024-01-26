import { expect } from '@loopback/testlab';
import { mapOutputToInputs, scriptsFromWorkflow } from '../../services/CWLToArgo';
import { CwlWorkflow } from '../../types';
import { readScriptJson } from './test.cwl.script';

const montage = 'src/__tests__/data/CLT/montage.json';
const recycle = 'src/__tests__/data/CLT/recycle.json';
const ome2zarr = 'src/__tests__/data/CLT/ometozarr.json';

const argoOperator = 'src/operators/argo-file-pattern-operator.json';
const pluginGen = 'src/__tests__/data/CLT/plugin-generator-argo.json';

describe('Testing Output Param Parsing', () => {
	it('WIPP Script with input and output', () => {
		const montageRecycleAssemble = {
			name: 'montage-recycle-assembly',
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'montage-recycle-assembly',
			inputs: {
				montageFilePattern: 'string',
				montageInpDir: 'Directory',
				montageLayout: 'string[]',
				montageImageSpacing: 'int',
				montageGridSpacing: 'int',
				montageOutputName: 'Directory',
			},
			outputs: {
				montageOut: {
					type: 'Directory',
					outputSource: 'montage/montageOut',
				},
				recycleOut: {
					type: 'Directory',
					outputSource: 'recycle/recycleOut',
				},
			},
			steps: {
				montage: {
					run: montage,
					in: {
						filePattern: 'montageFilePattern',
						inpDir: 'montageInpDir',
						imageSpacing: 'montageImageSpacing',
						gridSpacing: 'montageGridSpacing',
						layout: 'montageLayout',
						outDir: 'montageOutputName',
					},
					out: ['montageOut'],
				},
				recycle: {
					run: recycle,
					in: {
						stitchDir: 'montage/montageOut',
						collectionDir: 'montageInpDir',
						stitchRegex: 'recycleCollectionRegex',
						collectionRegex: 'recycleCollectionRegex',
						groupBy: 'recycleGroupBy',
						outDir: 'recycleOutputName',
					},
					out: ['recycleOut'],
				},
			},
		};
		const expectedOutput = [
			{
				outputName: 'montageOut',
				inputName: 'montageOutputName',
			},
			{ outputName: 'recycleOut', inputName: 'recycleOutputName' },
		];
		const jobs = [
			{
				id: 'montage',
				workflowId: 'montage-recycle-assemble',
				commandLineTool: readScriptJson(montage),
				inputs: {},
				outputs: {},
				stepName: 'montage',
			},
			{
				id: 'recycle',
				workflowId: 'montage-recycle-assemble',
				commandLineTool: readScriptJson(recycle),
				inputs: {},
				outputs: {},
				stepName: 'recycle',
			},
		];
		const returnValue = mapOutputToInputs(scriptsFromWorkflow(montageRecycleAssemble, jobs));
		expect(returnValue).to.be.eql(expectedOutput);
	});
	it('dynamic workflows', () => {
		const dynamicScatter: CwlWorkflow = {
			id: 'blah',
			cwlVersion: 'v1.0',
			class: 'Workflow',
			inputs: {
				'file-pattern-input': 'Directory',
				pattern: 'string',
				'file-pattern-output': 'Directory',
				chunkSize: 'int',
			},
			outputs: {
				ome2zarroutDir: {
					type: 'Directory[]',
					outputSource: ['ome2zarr/ome2zarroutDir'],
				},
				ome2zarrStdOut: {
					type: 'File[]',
					outputSource: ['ome2zarr/ome2zarrStdOut'],
				},
				ome2zarrStdErr: {
					type: 'File[]',
					outputSource: ['ome2zarr/ome2zarrStdErr'],
				},
			},
			steps: {
				filepattern: {
					run: 'plugin:6206a0b5bd104b0010050abd',
					in: {
						inpDir: 'file-pattern-input',
						pattern: 'pattern',
						outDir: 'file-pattern-output',
						chunkSize: 'chunkSize',
					},
					out: ['filepatternoutDir'],
				},
				ome2zarr: {
					run: 'plugin:61ae7a98f7ab3a5033f3390b',
					scatter: 'filePattern',
					in: {
						filePattern: 'argoOperator/filePatterns',
						inpDir: 'inpDir',
						outDir: 'outDir',
					},
					out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
				},
				argoOperator: {
					run: 'src/operators/argoFileOperator.cwl',
					in: {
						input: 'filepattern/filepatternoutDir',
					},
					out: ['filePatterns'],
				},
			},
		};
		const initialJobs = [
			{
				id: 'filepattern',
				workflowId: 'blah',
				commandLineTool: readScriptJson(pluginGen),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: 'zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {
					filepatternoutDir: {},
				},
				stepName: 'file-gen',
			},
			{
				id: 'omezarr',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: 'zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {},
				stepName: 'omezarr.1',
			},
			{
				id: 'argoFileOperator',
				workflowId: 'blah',
				commandLineTool: readScriptJson(argoOperator),
				inputs: { input: 'patternGenerator/filepatternoutDir' },
				outputs: {},
				stepName: 'argoFileOperator',
			},
		];
		expect(mapOutputToInputs(scriptsFromWorkflow(dynamicScatter, initialJobs))).to.be.eql([
			{ outputName: 'filepatternoutDir', inputName: 'file-pattern-output' },
			{ outputName: 'ome2zarroutDir', inputName: 'outDir' },
			{
				outputName: 'filePatterns',
				inputName: 'filepattern/filepatternoutDir',
			},
		]);
	});
	it('dynamic workflows two steps', () => {
		const dynamicScatter: CwlWorkflow = {
			id: 'blah',
			cwlVersion: 'v1.0',
			class: 'Workflow',
			inputs: {
				'file-pattern-input': 'Directory',
				pattern: 'string',
				'file-pattern-output': 'Directory',
				chunkSize: 'int',
			},
			outputs: {
				ome2zarroutDir: {
					type: 'Directory[]',
					outputSource: ['ome2zarr/ome2zarroutDir'],
				},
				ome2zarrStdOut: {
					type: 'File[]',
					outputSource: ['ome2zarr/ome2zarrStdOut'],
				},
				ome2zarrStdErr: {
					type: 'File[]',
					outputSource: ['ome2zarr/ome2zarrStdErr'],
				},
			},
			steps: {
				filepattern: {
					run: 'plugin:6206a0b5bd104b0010050abd',
					in: {
						inpDir: 'file-pattern-input',
						pattern: 'pattern',
						outDir: 'file-pattern-output',
						chunkSize: 'chunkSize',
					},
					out: ['filepatternoutDir'],
				},
				ome2zarr: {
					run: 'plugin:61ae7a98f7ab3a5033f3390b',
					scatter: 'filePattern',
					in: {
						filePattern: 'argoOperator/filePatterns',
						inpDir: 'inpDir',
						outDir: 'outDir',
					},
					out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
				},
				argoOperator: {
					run: 'src/operators/argoFileOperator.cwl',
					in: {
						input: 'filepattern/filepatternoutDir',
					},
					out: ['filePatterns'],
				},
				filepattern2: {
					run: 'plugin:6206a0b5bd104b0010050abd',
					in: {
						inpDir: 'file-pattern-input',
						pattern: 'pattern',
						outDir: 'file-pattern-output',
						chunkSize: 'chunkSize',
					},
					out: ['filepatternoutDir'],
				},
				ome2zarr2: {
					run: 'plugin:61ae7a98f7ab3a5033f3390b',
					scatter: 'filePattern',
					in: {
						filePattern: 'argoOperator-2/filePatterns',
						inpDir: 'inpDir',
						outDir: 'outDir',
					},
					out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
				},
				'argoOperator-2': {
					run: 'src/operators/argoFileOperator.cwl',
					in: {
						input: 'filepattern2/filepatternoutDir',
					},
					out: ['filePatterns'],
				},
			},
		};
		const initialJobs = [
			{
				id: 'filepattern',
				workflowId: 'blah',
				commandLineTool: readScriptJson(pluginGen),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: 'zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {
					filepatternoutDir: {},
				},
				stepName: 'file-gen',
			},
			{
				id: 'omezarr',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: 'zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {},
				stepName: 'omezarr.1',
			},
			{
				id: 'argoFileOperator',
				workflowId: 'blah',
				commandLineTool: readScriptJson(argoOperator),
				inputs: { input: 'filepattern/filepatternoutDir' },
				outputs: {},
				stepName: 'argoFileOperator',
			},
			{
				id: 'filepattern2',
				workflowId: 'blah',
				commandLineTool: readScriptJson(pluginGen),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: 'zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {
					filepatternoutDir: {},
				},
				stepName: 'filepattern2',
			},
			{
				id: 'omezarr2',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: 'zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {},
				stepName: 'omezarr2.1',
			},
			{
				id: 'argoFileOperator-1',
				workflowId: 'blah',
				commandLineTool: readScriptJson(argoOperator),
				inputs: { input: 'filepattern2/filepatternoutDir' },
				outputs: {},
				stepName: 'argoFileOperator-1',
			},
		];
		expect(mapOutputToInputs(scriptsFromWorkflow(dynamicScatter, initialJobs))).to.be.eql([
			{ outputName: 'filepatternoutDir', inputName: 'file-pattern-output' },
			{ outputName: 'ome2zarroutDir', inputName: 'outDir' },
			{
				outputName: 'filePatterns',
				inputName: 'filepattern/filepatternoutDir',
			},
			{ outputName: 'filepatternoutDir', inputName: 'file-pattern-output' },
			{ outputName: 'ome2zarroutDir', inputName: 'outDir' },
			{
				outputName: 'filePatterns',
				inputName: 'filepattern2/filepatternoutDir',
			},
		]);
	});
});
