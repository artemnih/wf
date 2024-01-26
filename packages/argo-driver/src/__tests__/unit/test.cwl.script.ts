/* eslint-disable @typescript-eslint/no-misused-promises */
import { CwlScript, CwlScriptInAndOut } from '../../types';
import { readFileSync } from 'fs';
import { scriptsFromWorkflow } from '../../services/CWLToArgo';
import { expect } from '@loopback/testlab';
const helloWorld1 = 'src/__tests__/data/CLT/echo.json';
const montage = 'src/__tests__/data/CLT/montage.json';
const recycle = 'src/__tests__/data/CLT/recycle.json';

export function readScriptJson(inputFile: string): CwlScript {
	const scriptEntry: CwlScript = JSON.parse(
		readFileSync(inputFile, {
			encoding: 'utf8',
		}),
	);
	return scriptEntry;
}

describe('Convert CWlWorkflow to Script Array', () => {
	it('Workflow With 1 script', () => {
		const helloWorld1Workflow = {
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'hello-world-1',
			inputs: { hello1: 'string' },
			outputs: {},
			steps: {
				step: {
					run: helloWorld1,
					in: { hello1: 'hello1' },
					out: [],
				},
			},
		};
		const helloWorld1Script: CwlScript = {
			cwlVersion: 'v1.0',
			id: 'HelloWorld-1',
			class: 'CommandLineTool',
			requirements: { DockerRequirement: { dockerPull: 'busybox' } },
			baseCommand: ['echo'],
			inputs: {
				hello: { type: 'string', inputBinding: { prefix: '--hello' } },
			},
			outputs: {},
		};

		const cwlScriptInAndOut = scriptsFromWorkflow(helloWorld1Workflow, [
			{
				id: 'HelloWorld-1',
				workflowId: 'HelloWorld-1',
				commandLineTool: helloWorld1Script,
				inputs: { hello: 'hello1' },
				outputs: {},
				stepName: 'HelloWorld-1',
			},
		]);
		expect(cwlScriptInAndOut.length).to.be.eql(1);
		expect(cwlScriptInAndOut[0]).to.be.eql({
			cwlScript: helloWorld1Script,
			in: { hello1: 'hello1' },
			out: [],
		});
	});
	it('Workflow With two scripts', () => {
		const helloWorld2Workflow = {
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'hello-world-2',
			inputs: { hello1: 'string', hello2: 'string' },
			outputs: {},
			steps: {
				step1: {
					run: helloWorld1,
					in: { hello1: 'hello1' },
					out: [],
				},
				step2: {
					run: helloWorld1,
					in: { hello1: 'hello2' },
					out: [],
				},
			},
		};
		const helloWorld1Script: CwlScript = {
			cwlVersion: 'v1.0',
			id: 'HelloWorld-1',
			class: 'CommandLineTool',
			requirements: { DockerRequirement: { dockerPull: 'busybox' } },
			baseCommand: ['echo'],
			inputs: {
				hello: { type: 'string', inputBinding: { prefix: '--hello' } },
			},
			outputs: {},
		};
		const helloWorld1ScriptInAndOut: CwlScriptInAndOut = {
			cwlScript: helloWorld1Script,
			in: { hello1: 'hello1' },
			out: [],
		};

		const scriptArray = scriptsFromWorkflow(helloWorld2Workflow, [
			{
				id: 'blah',
				workflowId: 'blah',
				commandLineTool: helloWorld1Script,
				inputs: {},
				outputs: {},
				stepName: 'blah',
			},
			{
				id: 'blah2',
				workflowId: 'blah',
				commandLineTool: helloWorld1Script,
				inputs: {},
				outputs: {},
				stepName: 'blah2',
			},
		]);
		expect(scriptArray.length).to.be.eql(2);
		expect(scriptArray[0]).to.be.eql(helloWorld1ScriptInAndOut);
		expect(scriptArray[1]).to.be.eql({
			cwlScript: helloWorld1Script,
			in: { hello1: 'hello2' },
			out: [],
		});
	});
	it('WIPP Workflow with montage and recycle', async () => {
		const montageRecycle = {
			name: 'montage-recycle',
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'montage-recycle',
			inputs: {
				montageFilePattern: 'string',
				montageInpDir: 'Directory',
				montageLayout: 'string[]',
				montageImageSpacing: 'int',
				montageGridSpacing: 'int',
				montageOutputName: 'Directory',
				recycleGroupBy: 'string',
				recycleCollectionRegex: 'string',
				recycleOutputName: 'Directory',
			},
			outputs: {
				recycleOut: {
					type: 'Directory',
					outputSource: 'recycle/recycleOut',
				},
				montageOut: {
					type: 'Directory',
					outputSource: 'montage/montageOut',
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
						groupBy: 'recycleGroupBy',
						collectionRegex: 'recycleCollectionRegex',
						stitchRegex: 'recycleCollectionRegex',
						stitchDir: 'montage/montageOut',
						collectionDir: 'montageInpDir',
						outDir: 'recycleOutputName',
					},
					out: ['recycleOut'],
				},
			},
		};

		const cwlScriptInAndOut = scriptsFromWorkflow(montageRecycle, [
			{
				id: 'montage',
				workflowId: 'montage-recycle-assembly',
				commandLineTool: readScriptJson(montage),
				inputs: {},
				outputs: {},
				stepName: 'montage',
			},
			{
				id: 'recycle',
				workflowId: 'montage-recycle-assembly',
				commandLineTool: readScriptJson(recycle),
				inputs: {},
				outputs: {},
				stepName: 'recycle',
			},
		]);
		expect(cwlScriptInAndOut.length).to.be.eql(2);
		expect(cwlScriptInAndOut[0].cwlScript).to.be.eql(readScriptJson(montage));
		expect(cwlScriptInAndOut[1].cwlScript).to.be.eql(readScriptJson(recycle));
	});
});
