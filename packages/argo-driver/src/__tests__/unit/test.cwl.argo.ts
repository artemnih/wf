import { cwlToArgo } from '../../services/CWLToArgo';
import { expect } from '@loopback/testlab';
import { CwlWorkflow, MinimalJob } from '../../types';
import { readScriptJson } from './test.cwl.script';

const helloWorld1 = 'src/__tests__/data/CLT/echo.json';
const sleep = 'src/__tests__/data/CLT/sleep.json';
const montage = 'src/__tests__/data/CLT/montage.json';
const recycle = 'src/__tests__/data/CLT/recycle.json';
const pluginGen = 'src/__tests__/data/CLT/plugin-generator-argo.json';
const ome2zarr = 'src/__tests__/data/CLT/ometozarr.json';

describe('Convert CwlWorkflow to Argo Workflow', () => {
	it('Hello World to CWL 1', () => {
		const helloWorld1Workflow = {
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'hello-world-1',
			inputs: { hello1: 'string' },
			outputs: {},
			steps: {
				step: {
					run: helloWorld1,
					in: { hello: 'hello1' },
					out: [],
				},
			},
		};
		const helloWorldParams = {
			hello1: 'hello test1',
		};
		const helloWorldJobs: MinimalJob[] = [
			{
				id: 'hello-world-1',
				workflowId: 'hello-world-1',
				commandLineTool: readScriptJson(helloWorld1),
				inputs: { hello: 'hello test1' },
				outputs: {},
				stepName: 'hello-world-1',
			},
		];
		const expectedArgoWorkflow = {
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'hello-world-1',
					namespace: 'default',
					labels: {
						'workflows.argoproj.io/archive-strategy': 'false',
					},
				},
				spec: {
					entrypoint: 'workflow',
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: {
								claimName: 'compute-pv-claim',
							},
						},
					],
					templates: [
						{
							name: 'workflow',
							dag: {
								tasks: [
									{
										name: 'HelloWorld-1',
										template: 'HelloWorld-1',
										arguments: {
											parameters: [
												{
													name: 'hello',
													value: 'hello test1',
												},
											],
										},
									},
								],
							},
						},
						{
							name: 'HelloWorld-1',
							inputs: {
								parameters: [
									{
										name: 'hello',
									},
								],
							},
							container: {
								image: 'busybox',
								command: ['echo'],
								args: ['--hello', '{{inputs.parameters.hello}}'],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/HelloWorld-1`,
										subPath: `temp/jobs/HelloWorld-1`,
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		};

		const argoWorkflow = cwlToArgo(helloWorld1Workflow, helloWorldParams, helloWorldJobs);

		expect(argoWorkflow).to.be.eql(expectedArgoWorkflow);
	});
	it('Sleep to CWL 1', () => {
		const sleepWorkflow = {
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'sleep-workflow',
			inputs: { sleepParam: 'int' },
			outputs: {},
			steps: {
				step: {
					run: sleep,
					in: { sleepParam: 'sleepParam' },
					out: [],
				},
			},
		};
		const sleepParams = {
			sleepParam: 100,
		};
		const sleepJobs: MinimalJob[] = [
			{
				id: 'sleep',
				workflowId: 'sleep-workflow',
				commandLineTool: readScriptJson(sleep),
				inputs: { sleepParam: '100' },
				stepName: 'sleep',
				outputs: {},
			},
		];
		const expectedArgoWorkflow = {
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'sleep-workflow',
					namespace: 'default',
					labels: {
						'workflows.argoproj.io/archive-strategy': 'false',
					},
				},
				spec: {
					entrypoint: 'workflow',
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: {
								claimName: 'compute-pv-claim',
							},
						},
					],
					templates: [
						{
							name: 'workflow',

							dag: {
								tasks: [
									{
										name: 'sleep',
										template: 'sleep',
										arguments: {
											parameters: [
												{
													name: 'sleepParam',
													value: 100,
												},
											],
										},
									},
								],
							},
						},
						{
							name: 'sleep',
							inputs: {
								parameters: [
									{
										name: 'sleepParam',
									},
								],
							},
							container: {
								image: 'busybox',
								command: ['sleep'],
								args: ['{{inputs.parameters.sleepParam}}'],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/sleep`,
										subPath: `temp/jobs/sleep`,
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		};

		const argoWorkflow = cwlToArgo(sleepWorkflow, sleepParams, sleepJobs);

		expect(argoWorkflow).to.be.eql(expectedArgoWorkflow);
	});
	it('Argo Workflow with Two Steps', () => {
		const helloWorldTwoSteps = {
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'hello-world-two-steps',
			inputs: {
				hello1: 'string',
				hello2: 'string',
			},
			outputs: {},
			steps: {
				step1: {
					run: helloWorld1,
					in: {
						hello: 'hello1',
					},
					out: [],
				},
				step2: {
					run: helloWorld1,
					in: {
						hello: 'hello2',
					},
					out: [],
				},
			},
		};
		const helloWorld2Params = {
			hello1: 'hello from 1',
			hello2: 'hello from 2',
		};
		const helloWorldJobs: MinimalJob[] = [
			{
				id: 'step-1',
				workflowId: 'hello-world-two-steps',
				commandLineTool: readScriptJson(helloWorld1),
				inputs: { hello: 'hello1' },
				outputs: {},
				stepName: 'step-1',
			},
			{
				id: 'step-2',
				workflowId: 'hello-world-two-steps',
				commandLineTool: readScriptJson(helloWorld1),
				inputs: { hello: 'hello1' },
				outputs: {},
				stepName: 'step-2',
			},
		];

		const expectedArgoWorkflow = {
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'hello-world-two-steps',
					namespace: 'default',
					labels: {
						'workflows.argoproj.io/archive-strategy': 'false',
					},
				},
				spec: {
					entrypoint: 'workflow',
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: {
								claimName: 'compute-pv-claim',
							},
						},
					],
					templates: [
						{
							name: 'workflow',

							dag: {
								tasks: [
									{
										name: 'HelloWorld-1',
										template: 'HelloWorld-1',
										arguments: {
											parameters: [
												{
													name: 'hello',
													value: 'hello from 1',
												},
											],
										},
									},
									{
										name: 'HelloWorld-1',
										template: 'HelloWorld-1',
										arguments: {
											parameters: [
												{
													name: 'hello',
													value: 'hello from 2',
												},
											],
										},
									},
								],
							},
						},
						{
							name: 'HelloWorld-1',
							inputs: {
								parameters: [
									{
										name: 'hello',
									},
								],
							},
							container: {
								image: 'busybox',
								command: ['echo'],
								args: ['--hello', '{{inputs.parameters.hello}}'],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/HelloWorld-1`,
										subPath: `temp/jobs/HelloWorld-1`,
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		};
		const argoWorkflow = cwlToArgo(helloWorldTwoSteps, helloWorld2Params, helloWorldJobs);

		expect(argoWorkflow).to.be.eql(expectedArgoWorkflow);
	});
	it('Argo Workflow with three steps (chained depency same plugin)', () => {
		const helloWorldTwoSteps = {
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'hello-world-two-steps',
			inputs: {
				hello1: 'string',
				hello2: 'string',
			},
			outputs: {},
			steps: {
				step1: {
					run: helloWorld1,
					in: {
						hello: 'hello1',
					},
					out: [],
				},
				step2: {
					run: helloWorld1,
					in: {
						hello: 'hello2',
					},
					out: [],
				},
			},
		};
		const helloWorld2Params = {
			hello1: 'hello from 1',
			hello2: 'hello from 2',
		};
		const helloWorldJobs: MinimalJob[] = [
			{
				id: 'step-1',
				workflowId: 'hello-world-two-steps',
				commandLineTool: readScriptJson(helloWorld1),
				inputs: { hello: 'hello1' },
				outputs: {},
				stepName: 'step-1',
			},
			{
				id: 'step-2',
				workflowId: 'hello-world-two-steps',
				commandLineTool: readScriptJson(helloWorld1),
				inputs: { hello: 'hello1' },
				outputs: {},
				stepName: 'step-2',
			},
		];

		const expectedArgoWorkflow = {
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'hello-world-two-steps',
					namespace: 'default',
					labels: {
						'workflows.argoproj.io/archive-strategy': 'false',
					},
				},
				spec: {
					entrypoint: 'workflow',
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: {
								claimName: 'compute-pv-claim',
							},
						},
					],
					templates: [
						{
							name: 'workflow',

							dag: {
								tasks: [
									{
										name: 'HelloWorld-1',
										template: 'HelloWorld-1',
										arguments: {
											parameters: [
												{
													name: 'hello',
													value: 'hello from 1',
												},
											],
										},
									},
									{
										name: 'HelloWorld-1',
										template: 'HelloWorld-1',
										arguments: {
											parameters: [
												{
													name: 'hello',
													value: 'hello from 2',
												},
											],
										},
									},
								],
							},
						},
						{
							name: 'HelloWorld-1',
							inputs: {
								parameters: [
									{
										name: 'hello',
									},
								],
							},
							container: {
								image: 'busybox',
								command: ['echo'],
								args: ['--hello', '{{inputs.parameters.hello}}'],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/HelloWorld-1`,
										subPath: `temp/jobs/HelloWorld-1`,
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		};
		const argoWorkflow = cwlToArgo(helloWorldTwoSteps, helloWorld2Params, helloWorldJobs);

		expect(argoWorkflow).to.be.eql(expectedArgoWorkflow);
	});

	it('montage-recycle test', () => {
		const workflow = {
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
		const montageJobParams = {
			montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
			montageInpDir: {
				class: 'Directory',
				path: '/data/inputs/images',
			},
			montageLayout: 'r,xy',
			montageImageSpacing: 10,
			montageGridSpacing: 20,
			montageOutputName: {
				class: 'Directory',
				path: '/data/outputs/montage',
			},
			recycleCollectionRegex: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
			recycleStitchDir: {
				class: 'Directory',
				path: 'data/inputs/temp/jobs/montage',
			},
			recycleCollectionDir: {
				class: 'Directory',
				path: '/data/inputs/images',
			},
			recycleGroupBy: 'r',
			recycleOutputName: {
				class: 'Directory',
				path: '/data/outputs/recycle',
			},
		};
		const montageRecycleJobs: MinimalJob[] = [
			{
				id: 'montage',
				workflowId: 'montage-recycle-assemble',
				commandLineTool: readScriptJson(montage),
				inputs: {
					montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
					montageInpDir: '/data/inputs/images',
					montageLayout: ['r', 'xy'],
					montageImagingSpacing: 10,
					montageGridSpacing: 20,
					montageOutputName: '/data/outputs/montage',
				},
				outputs: { montageOutName: '/data/outputs/montage' },
				stepName: 'montage',
			},
			{
				id: 'recycle',
				workflowId: 'montage-recycle-assemble',
				commandLineTool: readScriptJson(recycle),
				inputs: {
					recycleCollectionRegex: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
					recycleStitchDir: 'data/inputs/temp/jobs/montage',
					recycleCollectionDir: '/data/inputs/images',
					recycleGroupBy: 'r',
					recycleOutputName: '/data/outputs/recycle',
				},
				outputs: { recycleOut: '/data/outputs/recycle' },
				stepName: 'recycle',
			},
		];

		const expectedArgoWorkflow = {
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'montage-recycle-assemble',
					namespace: 'default',
					labels: {
						'workflows.argoproj.io/archive-strategy': 'false',
					},
				},
				spec: {
					entrypoint: 'workflow',
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: {
								claimName: 'compute-pv-claim',
							},
						},
					],
					templates: [
						{
							name: 'workflow',
							dag: {
								tasks: [
									{
										name: 'montage',
										template: 'montage',
										arguments: {
											parameters: [
												{
													name: 'filePattern',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'inpDir',
													value: '/data/inputs/images',
												},
												{
													name: 'imageSpacing',
													value: 10,
												},
												{
													name: 'gridSpacing',
													value: 20,
												},
												{
													name: 'layout',
													value: 'r,xy',
												},
												{
													name: 'outDir',
													value: '/data/outputs/montage',
												},
											],
										},
									},
									{
										name: 'recycle',
										template: 'recycle',
										dependencies: ['montage'],
										arguments: {
											parameters: [
												{
													name: 'stitchDir',
													value: '/data/inputs/temp/jobs/montage',
												},
												{
													name: 'collectionDir',
													value: '/data/inputs/images',
												},
												{
													name: 'stitchRegex',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'collectionRegex',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'groupBy',
													value: 'r',
												},
												{
													name: 'outDir',
													value: '/data/outputs/recycle',
												},
											],
										},
									},
								],
							},
						},

						{
							name: 'montage',
							inputs: {
								parameters: [
									{
										name: 'filePattern',
									},
									{
										name: 'inpDir',
									},
									{
										name: 'imageSpacing',
									},
									{
										name: 'gridSpacing',
									},
									{
										name: 'layout',
									},
									{
										name: 'outDir',
									},
								],
							},
							container: {
								image: 'labshare/polus-montage-plugin:compute-0.3.2',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--filePattern',
									'{{inputs.parameters.filePattern}}',
									'--inpDir',
									'{{inputs.parameters.inpDir}}',
									'--imageSpacing',
									'{{inputs.parameters.imageSpacing}}',
									'--gridSpacing',
									'{{inputs.parameters.gridSpacing}}',
									'--layout',
									'{{inputs.parameters.layout}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
								],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/montage`,
										subPath: `temp/jobs/montage`,
										readOnly: false,
									},
								],
							},
						},
						{
							name: 'recycle',
							inputs: {
								parameters: [
									{
										name: 'stitchDir',
									},
									{
										name: 'collectionDir',
									},
									{
										name: 'stitchRegex',
									},
									{
										name: 'collectionRegex',
									},
									{
										name: 'groupBy',
									},
									{
										name: 'outDir',
									},
								],
							},
							container: {
								image: 'labshare/polus-recycle-vector-plugin:compute-1.5.1',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--stitchDir',
									'{{inputs.parameters.stitchDir}}',
									'--collectionDir',
									'{{inputs.parameters.collectionDir}}',
									'--stitchRegex',
									'{{inputs.parameters.stitchRegex}}',
									'--collectionRegex',
									'{{inputs.parameters.collectionRegex}}',
									'--groupBy',
									'{{inputs.parameters.groupBy}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
								],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/recycle`,
										subPath: `temp/jobs/recycle`,
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		};

		const argoWorkflow = cwlToArgo(workflow, montageJobParams, montageRecycleJobs);
		expect(argoWorkflow).to.be.eql(expectedArgoWorkflow);
	});
	xit('montage-recycle-two test', () => {
		const workflow = {
			name: 'montage-recycle-two',
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'montage-recycle-two',
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
				recycleOut2: {
					type: 'Directory',
					outputSource: 'recycle2/recycleOut',
				},
				montageOut2: {
					type: 'Directory',
					outputSource: 'montage2/montageOut',
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
				montage2: {
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
				recycle2: {
					run: recycle,
					in: {
						stitchDir: 'montage2/montageOut',
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
		const montageJobParams = {
			montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
			montageInpDir: {
				class: 'Directory',
				path: '/data/inputs/images',
			},
			montageLayout: 'r,xy',
			montageImageSpacing: 10,
			montageGridSpacing: 20,
			montageOutputName: {
				class: 'Directory',
				path: '/data/outputs/montage',
			},
			recycleCollectionRegex: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
			recycleStitchDir: {
				class: 'Directory',
				path: 'data/inputs/temp/jobs/montage',
			},
			recycleCollectionDir: {
				class: 'Directory',
				path: '/data/inputs/images',
			},
			recycleGroupBy: 'r',
			recycleOutputName: {
				class: 'Directory',
				path: '/data/outputs/recycle',
			},
		};
		const montageRecycleAssembleJob: MinimalJob[] = [
			{
				id: 'montage',
				workflowId: 'montage-recycle-two',
				commandLineTool: readScriptJson(montage),
				inputs: {
					montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
					montageInpDir: '/data/inputs/images',
					montageLayout: ['r', 'xy'],
					montageImagingSpacing: 10,
					montageGridSpacing: 20,
					montageOutputName: '/data/outputs/montage',
				},
				outputs: { montageOutName: '/data/outputs/montage' },
				stepName: 'montage',
			},
			{
				id: 'recycle',
				workflowId: 'montage-recycle-two',
				commandLineTool: readScriptJson(recycle),
				inputs: {
					recycleCollectionRegex: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
					recycleStitchDir: 'data/inputs/temp/jobs/montage',
					recycleCollectionDir: '/data/inputs/images',
					recycleGroupBy: 'r',
					recycleOutputName: '/data/outputs/recycle',
				},
				outputs: { recycleOut: '/data/outputs/recycle' },
				stepName: 'recycle',
			},
			{
				id: 'montage2',
				workflowId: 'montage-recycle-two',
				commandLineTool: readScriptJson(montage),
				inputs: {
					montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
					montageInpDir: '/data/inputs/images',
					montageLayout: ['r', 'xy'],
					montageImagingSpacing: 10,
					montageGridSpacing: 20,
					montageOutputName: '/data/outputs/montage',
				},
				outputs: { montageOutName: '/data/outputs/montage' },
				stepName: 'montage',
			},
			{
				id: 'recycle2',
				workflowId: 'montage-recycle-assemble',
				commandLineTool: readScriptJson(recycle),
				inputs: {
					recycleCollectionRegex: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
					recycleStitchDir: 'data/inputs/temp/jobs/montage',
					recycleCollectionDir: '/data/inputs/images',
					recycleGroupBy: 'r',
					recycleOutputName: '/data/outputs/recycle',
				},
				outputs: { recycleOut: '/data/outputs/recycle' },
				stepName: 'recycle2',
			},
		];

		const expectedArgoWorkflow = {
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'montage-recycle-two',
					namespace: 'default',
					labels: {
						'workflows.argoproj.io/archive-strategy': 'false',
					},
				},
				spec: {
					entrypoint: 'workflow',
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: {
								claimName: 'compute-pv-claim',
							},
						},
					],
					templates: [
						{
							name: 'workflow',
							dag: {
								tasks: [
									{
										name: 'montage',
										template: 'montage',
										arguments: {
											parameters: [
												{
													name: 'filePattern',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'inpDir',
													value: '/data/inputs/images',
												},
												{
													name: 'imageSpacing',
													value: 10,
												},
												{
													name: 'gridSpacing',
													value: 20,
												},
												{
													name: 'layout',
													value: 'r,xy',
												},
												{
													name: 'outDir',
													value: '/data/outputs/montage',
												},
											],
										},
									},
									{
										name: 'recycle',
										template: 'recycle',
										dependencies: ['montage'],
										arguments: {
											parameters: [
												{
													name: 'stitchDir',
													value: '/data/inputs/temp/jobs/montage',
												},
												{
													name: 'collectionDir',
													value: '/data/inputs/images',
												},
												{
													name: 'stitchRegex',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'collectionRegex',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'groupBy',
													value: 'r',
												},
												{
													name: 'outDir',
													value: '/data/outputs/recycle',
												},
											],
										},
									},
									{
										name: 'montage2',
										template: 'montage',
										arguments: {
											parameters: [
												{
													name: 'filePattern',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'inpDir',
													value: '/data/inputs/images',
												},
												{
													name: 'imageSpacing',
													value: 10,
												},
												{
													name: 'gridSpacing',
													value: 20,
												},
												{
													name: 'layout',
													value: 'r,xy',
												},
												{
													name: 'outDir',
													value: '/data/outputs/montage',
												},
											],
										},
									},
									{
										name: 'recycle2',
										template: 'recycle',
										dependencies: ['montage2'],
										arguments: {
											parameters: [
												{
													name: 'stitchDir',
													value: '/data/inputs/temp/jobs/montage',
												},
												{
													name: 'collectionDir',
													value: '/data/inputs/images',
												},
												{
													name: 'stitchRegex',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'collectionRegex',
													value: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
												},
												{
													name: 'groupBy',
													value: 'r',
												},
												{
													name: 'outDir',
													value: '/data/outputs/recycle',
												},
											],
										},
									},
								],
							},
						},

						{
							name: 'montage',
							inputs: {
								parameters: [
									{
										name: 'filePattern',
									},
									{
										name: 'inpDir',
									},
									{
										name: 'imageSpacing',
									},
									{
										name: 'gridSpacing',
									},
									{
										name: 'layout',
									},
									{
										name: 'outDir',
									},
								],
							},
							container: {
								image: 'labshare/polus-montage-plugin:compute-0.3.2',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--filePattern',
									'{{inputs.parameters.filePattern}}',
									'--inpDir',
									'{{inputs.parameters.inpDir}}',
									'--imageSpacing',
									'{{inputs.parameters.imageSpacing}}',
									'--gridSpacing',
									'{{inputs.parameters.gridSpacing}}',
									'--layout',
									'{{inputs.parameters.layout}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
								],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/montage`,
										subPath: `temp/jobs/montage`,
										readOnly: false,
									},
								],
							},
						},
						{
							name: 'recycle',
							inputs: {
								parameters: [
									{
										name: 'stitchDir',
									},
									{
										name: 'collectionDir',
									},
									{
										name: 'stitchRegex',
									},
									{
										name: 'collectionRegex',
									},
									{
										name: 'groupBy',
									},
									{
										name: 'outDir',
									},
								],
							},
							container: {
								image: 'labshare/polus-recycle-vector-plugin:compute-1.5.1',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--stitchDir',
									'{{inputs.parameters.stitchDir}}',
									'--collectionDir',
									'{{inputs.parameters.collectionDir}}',
									'--stitchRegex',
									'{{inputs.parameters.stitchRegex}}',
									'--collectionRegex',
									'{{inputs.parameters.collectionRegex}}',
									'--groupBy',
									'{{inputs.parameters.groupBy}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
								],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/recycle`,
										subPath: `temp/jobs/recycle`,
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		};

		const argoWorkflow = cwlToArgo(workflow, montageJobParams, montageRecycleAssembleJob);
		expect(argoWorkflow).to.be.eql(expectedArgoWorkflow);
	});

	it('Scatter echo world', () => {
		const scatterHelloWorld = {
			cwlVersion: 'v1.0',
			class: 'Workflow',
			id: 'scatter-hello',
			inputs: { helloArray: 'string[]' },
			outputs: {},
			steps: {
				step: {
					run: helloWorld1,
					scatter: 'hello',
					in: { hello: 'helloArray' },
					out: [],
				},
			},
		};
		const helloWorldParams = {
			helloArray: ['hello', 'hola', 'nihao'],
		};
		const helloWorldJobs: MinimalJob[] = [
			{
				id: 'scatter-hello',
				workflowId: 'scatter-hello',
				commandLineTool: readScriptJson(helloWorld1),
				inputs: { hello: 'hello test1' },
				outputs: {},
				stepName: 'scatter-hello',
			},
		];
		const scatterArgoWorkflow = {
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'scatter-hello',
					namespace: 'default',
					labels: {
						'workflows.argoproj.io/archive-strategy': 'false',
					},
				},
				spec: {
					entrypoint: 'workflow',
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: {
								claimName: 'compute-pv-claim',
							},
						},
					],
					templates: [
						{
							name: 'workflow',
							dag: {
								tasks: [
									{
										name: 'HelloWorld-1',
										template: 'HelloWorld-1',
										arguments: {
											parameters: [
												{
													name: 'hello',
													value: '{{item}}',
												},
											],
										},
										withItems: ['hello', 'hola', 'nihao'],
									},
								],
							},
						},
						{
							name: 'HelloWorld-1',
							inputs: {
								parameters: [
									{
										name: 'hello',
									},
								],
							},
							container: {
								image: 'busybox',
								command: ['echo'],
								args: ['--hello', '{{inputs.parameters.hello}}'],
								volumeMounts: [
									{
										mountPath: '/data/inputs',
										name: 'compute-data-volume',
										readOnly: true,
									},
									{
										name: 'compute-data-volume',
										mountPath: `/data/outputs/HelloWorld-1`,
										subPath: `temp/jobs/HelloWorld-1`,
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		};

		const scatterArgoActual = cwlToArgo(scatterHelloWorld, helloWorldParams, helloWorldJobs);

		expect(scatterArgoActual).to.be.eql(scatterArgoWorkflow);
	});
	it('Scatter ome-to-zarr', () => {
		const omezarr: CwlWorkflow = {
			id: 'blah',
			class: 'Workflow',
			cwlVersion: 'v1.0',
			inputs: {
				inpDir: 'Directory',
				outDir: 'Directory',
				filePatternArray: 'string[]',
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
				ome2zarr: {
					run: 'plugin:61ae7a98f7ab3a5033f3390b',
					scatter: 'filePattern',
					in: {
						filePattern: 'filePatternArray',
						inpDir: 'inpDir',
						outDir: 'outDir',
					},
					out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
				},
			},
		};
		const cwlJobInputs = {
			inpDir: {
				class: 'Directory',
				path: '/home/kevin.hannon/data/images_dummy',
			},
			outDir: {
				class: 'Directory',
				path: 'zarr',
			},
			filePatternArray: ['blah_1', 'blah_2'],
		};
		const jobs: MinimalJob[] = [
			{
				id: 'omezarr',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/home/kevin.hannon/data/images_dummy',
					outDir: 'zarr',
					filePattern: 'blah_1',
				},
				outputs: {},
				stepName: 'omezarr.1',
			},
			{
				id: 'omezarr',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/home/kevin.hannon/data/images_dummy',
					outDir: 'zarr',
					filePattern: 'blah_2',
				},
				outputs: {},
				stepName: 'omezarr.2',
			},
		];

		const argo = cwlToArgo(omezarr, cwlJobInputs, jobs);
		expect(argo).to.be.eql({
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'blah',
					namespace: 'default',
					labels: { 'workflows.argoproj.io/archive-strategy': 'false' },
				},
				spec: {
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: { claimName: 'compute-pv-claim' },
						},
					],
					entrypoint: 'workflow',
					templates: [
						{
							name: 'workflow',
							dag: {
								tasks: [
									{
										name: 'ome2zarr',
										template: 'ome2zarr',
										arguments: {
											parameters: [
												{ name: 'filePattern', value: '{{item}}' },
												{
													name: 'inpDir',
													value: '/home/kevin.hannon/data/images_dummy',
												},
												{ name: 'outDir', value: 'zarr' },
											],
										},
										withItems: ['blah_1', 'blah_2'],
									},
								],
							},
						},
						{
							name: 'ome2zarr',
							inputs: {
								parameters: [{ name: 'filePattern' }, { name: 'inpDir' }, { name: 'outDir' }],
							},
							container: {
								image: 'labshare/polus-ome-zarr-converter-plugin:compute-0.2.1',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--filePattern',
									'{{inputs.parameters.filePattern}}',
									'--inpDir',
									'{{inputs.parameters.inpDir}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
								],
								volumeMounts: [
									{
										name: 'compute-data-volume',
										readOnly: true,
										mountPath: '/data/inputs',
									},
									{
										name: 'compute-data-volume',
										mountPath: '/data/outputs/ome2zarr',
										subPath: 'temp/jobs/ome2zarr',
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		});
	});
	it('dynamic scatter', () => {
		const dynamicScatter: CwlWorkflow = {
			id: 'blah',
			cwlVersion: 'v1.0',
			class: 'Workflow',
			inputs: {
				'file-pattern-input': 'Directory',
				pattern: 'string',
				'file-pattern-output': 'Directory',
				chunkSize: 'int',
				'ome2zarr-output': 'Directory',
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
						filePattern: 'filepattern/filepatternoutDir',
						inpDir: 'inpDir',
						outDir: 'ome2zarr-output',
					},
					out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
				},
			},
		};
		const cwlJobInputs = {
			inpDir: {
				class: 'Directory',
				path: '/project/labshare-compute/data/tiff-converter',
			},
			'ome2zarr-output': {
				class: 'Directory',
				path: '/data/outputs/ome2zarr',
			},
			'file-pattern-input': {
				class: 'Directory',
				path: '/project/labshare-compute/data/tiff-converter',
			},
			pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
			chunkSize: 2,
			'file-pattern-output': {
				class: 'Directory',
				path: '/data/outputs/filepattern',
			},
		};
		const jobs: MinimalJob[] = [
			{
				id: 'filepattern',
				workflowId: 'blah',
				commandLineTool: readScriptJson(pluginGen),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: '/data/outputs/filepattern',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {
					filepatternoutDir: {},
				},
				stepName: 'filepattern',
			},
			{
				id: 'omezarr',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: '/data/outputs/ome2zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
				},
				outputs: {},
				stepName: 'omezarr.1',
			},
		];
		expect(cwlToArgo(dynamicScatter, cwlJobInputs, jobs)).to.be.eql({
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'blah',
					namespace: 'default',
					labels: { 'workflows.argoproj.io/archive-strategy': 'false' },
				},
				spec: {
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: { claimName: 'compute-pv-claim' },
						},
					],
					entrypoint: 'workflow',
					templates: [
						{
							name: 'workflow',
							dag: {
								tasks: [
									{
										name: 'filepattern',
										template: 'filepattern',
										arguments: {
											parameters: [
												{
													name: 'inpDir',
													value: '/project/labshare-compute/data/tiff-converter',
												},
												{
													name: 'pattern',
													value: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
												},
												{ name: 'outDir', value: '/data/outputs/filepattern' },
												{ name: 'chunkSize', value: 2 },
											],
										},
									},
									{
										name: 'ome2zarr',
										template: 'ome2zarr',
										arguments: {
											parameters: [
												{ name: 'filePattern', value: '{{item}}' },
												{
													name: 'inpDir',
													value: '/project/labshare-compute/data/tiff-converter',
												},
												{ name: 'outDir', value: '/data/outputs/ome2zarr' },
											],
										},
										withParam: '{{tasks.argoFileOperator.outputs.result}}',
										dependencies: ['argoFileOperator'],
									},
									{
										name: 'argoFileOperator',
										template: 'argoFileOperator',
										arguments: {
											parameters: [
												{
													name: 'input',
													value: '/data/inputs/temp/jobs/filepattern',
												},
											],
										},
										dependencies: ['filepattern'],
									},
								],
							},
						},
						{
							name: 'filepattern',
							inputs: {
								parameters: [{ name: 'inpDir' }, { name: 'pattern' }, { name: 'outDir' }, { name: 'chunkSize' }],
							},
							container: {
								image: 'polusai/filepattern-generator-plugin:0.2.0',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--inpDir',
									'{{inputs.parameters.inpDir}}',
									'--pattern',
									'{{inputs.parameters.pattern}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
									'--chunkSize',
									'{{inputs.parameters.chunkSize}}',
								],
								volumeMounts: [
									{
										name: 'compute-data-volume',
										readOnly: true,
										mountPath: '/data/inputs',
									},
									{
										name: 'compute-data-volume',
										mountPath: '/data/outputs/filepattern',
										subPath: 'temp/jobs/filepattern',
										readOnly: false,
									},
								],
							},
						},
						{
							name: 'ome2zarr',
							inputs: {
								parameters: [{ name: 'filePattern' }, { name: 'inpDir' }, { name: 'outDir' }],
							},
							container: {
								image: 'labshare/polus-ome-zarr-converter-plugin:compute-0.2.1',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--filePattern',
									'{{inputs.parameters.filePattern}}',
									'--inpDir',
									'{{inputs.parameters.inpDir}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
								],
								volumeMounts: [
									{
										name: 'compute-data-volume',
										readOnly: true,
										mountPath: '/data/inputs',
									},
									{
										name: 'compute-data-volume',
										mountPath: '/data/outputs/ome2zarr',
										subPath: 'temp/jobs/ome2zarr',
										readOnly: false,
									},
								],
							},
						},
						{
							name: 'argoFileOperator',
							inputs: {
								parameters: [{ name: 'input' }],
							},
							container: {
								image: 'polusai/argo-file-pattern-operator:0.0.1',
								command: ['python3', '/opt/executables/main.py'],
								args: ['--input', '{{inputs.parameters.input}}'],
								volumeMounts: [
									{
										name: 'compute-data-volume',
										readOnly: true,
										mountPath: '/data/inputs',
									},
									{
										name: 'compute-data-volume',
										mountPath: '/data/outputs/argoFileOperator',
										subPath: 'temp/jobs/argoFileOperator',
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		});
	});
	xit('dynamic scatter two steps', () => {
		// Test is not working as of now.  N
		const dynamicScatterTwo: CwlWorkflow = {
			id: 'blah',
			cwlVersion: 'v1.0',
			class: 'Workflow',
			inputs: {
				'file-pattern-input': 'Directory',
				pattern: 'string',
				'file-pattern-output': 'Directory',
				outDir: 'Directory',
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
						filePattern: 'filepattern/filepatternoutDir',
						inpDir: 'file-pattern-input',
						outDir: 'outDir',
					},
					out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
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
						filePattern: 'filepattern/filepatternoutDir',
						inpDir: 'inpDir',
						outDir: 'outDir',
					},
					out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
				},
			},
		};
		const cwlJobInputs = {
			inpDir: {
				class: 'Directory',
				path: '/project/labshare-compute/data/tiff-converter',
			},
			outDir: {
				class: 'Directory',
				path: '/data/outputs/ome2zarr',
			},
			'file-pattern-input': {
				class: 'Directory',
				path: '/project/labshare-compute/data/tiff-converter',
			},
			pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
			chunkSize: 2,
			'file-pattern-output': {
				class: 'Directory',
				path: '/data/outputs/filepattern',
			},
		};
		const jobs: MinimalJob[] = [
			{
				id: 'filepattern',
				workflowId: 'blah',
				commandLineTool: readScriptJson(pluginGen),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: '/data/outputs/filepattern',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/project/labshare-compute/toil-temp/output',
				},
				outputs: {
					filepatternoutDir: {},
				},
				stepName: 'filepattern',
			},
			{
				id: 'ome2zarr',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: '/data/outputs/ome2zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/data/outputs/zarr',
				},
				outputs: {},
				stepName: 'ome2zarr.1',
			},
			{
				id: 'filepattern2',
				workflowId: 'blah',
				commandLineTool: readScriptJson(pluginGen),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: '/data/outputs/filepattern',
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
				id: 'ome2zarr2',
				workflowId: 'blah',
				commandLineTool: readScriptJson(ome2zarr),
				inputs: {
					inpDir: '/project/labshare-compute/data/tiff-converter',
					outDir: '/data/outputs/ome2zarr',
					'file-pattern-input': '/project/labshare-compute/data/tiff-converter',
					pattern: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
					chunkSize: 2,
					'file-pattern-output': '/data/outputs/ome2zarr',
				},
				outputs: {},
				stepName: 'ome2zarr2.1',
			},
		];
		const cwlargo = cwlToArgo(dynamicScatterTwo, cwlJobInputs, jobs);
		expect(cwlargo).to.be.eql({
			namespace: 'default',
			serverDryRun: false,
			workflow: {
				apiVersion: 'argoproj.io/v1alpha1',
				kind: 'Workflow',
				metadata: {
					name: 'blah',
					namespace: 'default',
					labels: { 'workflows.argoproj.io/archive-strategy': 'false' },
				},
				spec: {
					volumes: [
						{
							name: 'compute-data-volume',
							persistentVolumeClaim: { claimName: 'compute-pv-claim' },
						},
					],
					entrypoint: 'workflow',
					templates: [
						{
							name: 'workflow',
							dag: {
								tasks: [
									{
										name: 'filepattern',
										template: 'filepattern',
										arguments: {
											parameters: [
												{
													name: 'inpDir',
													value: '/project/labshare-compute/data/tiff-converter',
												},
												{
													name: 'pattern',
													value: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
												},
												{ name: 'outDir', value: '/data/outputs/filepattern' },
												{ name: 'chunkSize', value: 2 },
											],
										},
									},
									{
										name: 'ome2zarr',
										template: 'ome2zarr',
										arguments: {
											parameters: [
												{ name: 'filePattern', value: '{{item}}' },
												{
													name: 'inpDir',
													value: '/project/labshare-compute/data/tiff-converter',
												},
												{ name: 'outDir', value: '/data/outputs/ome2zarr' },
											],
										},
										withParam: '{{tasks.argoFileOperator.outputs.result}}',
										dependencies: ['argoFileOperator'],
									},
									{
										name: 'argoFileOperator',
										template: 'argoFileOperator',
										arguments: {
											parameters: [
												{
													name: 'input',
													value: '/data/inputs/temp/jobs/filepattern',
												},
											],
										},
										dependencies: ['filepattern'],
									},

									{
										name: 'filepattern',
										template: 'filepattern',
										arguments: {
											parameters: [
												{
													name: 'inpDir',
													value: '/project/labshare-compute/data/tiff-converter',
												},
												{
													name: 'pattern',
													value: 'x{x+}_y{y+}_wx{t}_wy{p}_c{c}.ome.tif',
												},
												{ name: 'outDir', value: '/data/outputs/filepattern' },
												{ name: 'chunkSize', value: 2 },
											],
										},
									},
									{
										name: 'ome2zarr',
										template: 'ome2zarr',
										arguments: {
											parameters: [
												{ name: 'filePattern', value: '{{item}}' },
												{
													name: 'inpDir',
													value: '/project/labshare-compute/data/tiff-converter',
												},
												{ name: 'outDir', value: '/data/outputs/ome2zarr' },
											],
										},
										withParam: '{{tasks.argoFileOperator.outputs.result}}',
										dependencies: ['argoFileOperator'],
									},
									{
										name: 'argoFileOperator',
										template: 'argoFileOperator',
										arguments: {
											parameters: [
												{
													name: 'input',
													value: '/data/inputs/temp/jobs/filepattern',
												},
											],
										},
										dependencies: ['filepattern'],
									},
								],
							},
						},

						{
							name: 'filepattern',
							inputs: {
								parameters: [{ name: 'inpDir' }, { name: 'pattern' }, { name: 'outDir' }, { name: 'chunkSize' }],
							},
							container: {
								image: 'kevinpatrickhannon/file-pattern-json:0.0.1',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--inpDir',
									'{{inputs.parameters.inpDir}}',
									'--pattern',
									'{{inputs.parameters.pattern}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
									'--chunkSize',
									'{{inputs.parameters.chunkSize}}',
								],
								volumeMounts: [
									{
										name: 'compute-data-volume',
										readOnly: true,
										mountPath: '/data/inputs',
									},
									{
										name: 'compute-data-volume',
										mountPath: '/data/outputs/filepattern',
										subPath: 'temp/jobs/filepattern',
										readOnly: false,
									},
								],
							},
						},
						{
							name: 'ome2zarr',
							inputs: {
								parameters: [{ name: 'filePattern' }, { name: 'inpDir' }, { name: 'outDir' }],
							},
							container: {
								image: 'labshare/polus-ome-zarr-converter-plugin:compute-0.2.1',
								command: ['python3', '/opt/executables/main.py'],
								args: [
									'--filePattern',
									'{{inputs.parameters.filePattern}}',
									'--inpDir',
									'{{inputs.parameters.inpDir}}',
									'--outDir',
									'{{inputs.parameters.outDir}}',
								],
								volumeMounts: [
									{
										name: 'compute-data-volume',
										readOnly: true,
										mountPath: '/data/inputs',
									},
									{
										name: 'compute-data-volume',
										mountPath: '/data/outputs/ome2zarr',
										subPath: 'temp/jobs/ome2zarr',
										readOnly: false,
									},
								],
							},
						},
						{
							name: 'argoFileOperator',
							inputs: {
								parameters: [{ name: 'input' }],
							},
							container: {
								image: 'polusai/argo-file-pattern-operator:0.0.1',
								command: ['python3', '/opt/executables/main.py'],
								args: ['--input', '{{inputs.parameters.input}}'],
								volumeMounts: [
									{
										name: 'compute-data-volume',
										readOnly: true,
										mountPath: '/data/inputs',
									},
									{
										name: 'compute-data-volume',
										mountPath: '/data/outputs/argoFileOperator',
										subPath: 'temp/jobs/argoFileOperator',
										readOnly: false,
									},
								],
							},
						},
					],
				},
			},
		});
	});
});
