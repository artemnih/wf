// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { Job, Workflow } from '../../../models';
// import { cwlJobInputs } from '../../../services/CWLConvertors';
// import { workflowToJobs } from '../../../services';
// import { createStubInstance, expect, StubbedInstanceWithSinonAccessor } from '@loopback/testlab';
// import { readFileSync } from 'fs';

// const montage = 'src/__tests__/data/CLT/612fc61ba21dcd5b4f2abbe1.cwl';
// const recycle = 'src/__tests__/data/CLT/612fc674a21dcd5b4f2abbe2.cwl';
// const assemble = 'src/__tests__/data/CLT/61313a2fe4517d7795c80a79.cwl';
// const readFile = (file: string) => {
// 	return JSON.parse(readFileSync(file, 'utf8'));
// };
// describe('Workflow to Job Array', () => {
// 	it('montage-recycle cwl workflow', async () => {
// 		const workflow = {
// 			name: 'hello',
// 			id: 'hello',
// 			driver: 'CWL',
// 			dateCreated: '2021-08-13T17:33:02.327Z',
// 			inputs: {
// 				montageFilePattern: 'string',
// 				montageInpDir: 'Directory',
// 				montageLayout: 'string[]',
// 				montageImageSpacing: 'int',
// 				montageGridSpacing: 'int',
// 				montageOutputName: 'Directory',
// 				recycleGroupBy: 'string',
// 				recycleCollectionRegex: 'string',
// 				recycleOutputName: 'Directory',
// 				assembleTimeSliceNaming: 'boolean',
// 				assembleOutDir: 'Directory',
// 			},
// 			outputs: {
// 				recycleOut: {
// 					type: 'Directory',
// 					outputSource: 'recycle/recycleOut',
// 				},
// 				recycleStdErr: {
// 					type: 'File',
// 					outputSource: 'recycle/recycleStdErr',
// 				},
// 				recycleStdOut: {
// 					type: 'File',
// 					outputSource: 'recycle/recycleStdOut',
// 				},
// 				montageOut: {
// 					type: 'Directory',
// 					outputSource: 'montage/montageOut',
// 				},
// 				montageStdErr: {
// 					type: 'File',
// 					outputSource: 'montage/montageStdErr',
// 				},
// 				montageStdOut: {
// 					type: 'File',
// 					outputSource: 'montage/montageStdOut',
// 				},
// 				assembleOut: {
// 					type: 'Directory',
// 					outputSource: 'assemble/assembleOut',
// 				},
// 				assembleStdErr: {
// 					type: 'File',
// 					outputSource: 'assemble/assembleStdErr',
// 				},
// 				assembleStdOut: {
// 					type: 'File',
// 					outputSource: 'assemble/assembleStdOut',
// 				},
// 			},
// 			cwlJobInputs: {
// 				montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
// 				montageInpDir: {
// 					class: 'Directory',
// 					path: 'data/images',
// 				},
// 				montageLayout: ['r', 'xy'],
// 				montageImageSpacing: 10,
// 				montageGridSpacing: 20,
// 				montageOutputName: {
// 					class: 'Directory',
// 					path: 'data/montage',
// 				},
// 				recycleCollectionRegex: 'p{tt}_x{xx}_y{yy}_r{rr}_c{cc}.ome.tif',
// 				recycleStitchDir: {
// 					class: 'Directory',
// 					path: 'data/montage',
// 				},
// 				recycleCollectionDir: {
// 					class: 'Directory',
// 					path: 'data/images',
// 				},
// 				recycleGroupBy: 'r',
// 				recycleOutputName: {
// 					class: 'Directory',
// 					path: 'data/recycle',
// 				},
// 				assembleTimeSliceNaming: false,
// 				assembleOutDir: {
// 					class: 'Directory',
// 					path: 'data/assemble',
// 				},
// 			},
// 			steps: {
// 				montage: {
// 					run: montage,
// 					in: {
// 						filePattern: 'montageFilePattern',
// 						inpDir: 'montageInpDir',
// 						imageSpacing: 'montageImageSpacing',
// 						gridSpacing: 'montageGridSpacing',
// 						layout: 'montageLayout',
// 						outDir: 'montageOutputName',
// 					},
// 					out: ['montageOut', 'montageStdOut', 'montageStdErr'],
// 				},
// 				recycle: {
// 					run: recycle,
// 					in: {
// 						groupBy: 'recycleGroupBy',
// 						collectionRegex: 'recycleCollectionRegex',
// 						stitchRegex: 'recycleCollectionRegex',
// 						stitchDir: 'montage/montageOut',
// 						collectionDir: 'montageInpDir',
// 						outDir: 'recycleOutputName',
// 					},
// 					out: ['recycleOut', 'recycleStdOut', 'recycleStdErr'],
// 				},
// 				assemble: {
// 					run: assemble,
// 					in: {
// 						stitchPath: 'recycle/recycleOut',
// 						imgPath: 'montageInpDir',
// 						timesliceNaming: 'assembleTimeSliceNaming',
// 						output: 'assembleOutDir',
// 					},
// 					out: ['assembleOut', 'assembleStdOut', 'assembleStdErr'],
// 				},
// 			},
// 		};
// 		const montageCLT = readFile(montage);
// 		const recycleClt = readFile(recycle);
// 		const assembleClt = readFile(assemble);
// 		const expectedValue = [
// 			new Job({
// 				driver: workflow.driver,
// 				dateCreated: '2021-08-13T17:33:02.327Z',
// 				workflowId: workflow.name,
// 				status: 'PENDING',
// 				stepName: 'montage',
// 				commandLineTool: montageCLT,
// 				inputs: {
// 					filePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
// 					inpDir: 'data/images',
// 					imageSpacing: 10,
// 					gridSpacing: 20,
// 					layout: ['r', 'xy'],
// 					outDir: 'data/montage',
// 				},
// 				outputs: {
// 					montageOut: '',
// 					montageStdOut: '',
// 					montageStdErr: '',
// 				},
// 			}),
// 			new Job({
// 				driver: workflow.driver,
// 				workflowId: workflow.name,
// 				dateCreated: '2021-08-13T17:33:02.327Z',
// 				status: 'PENDING',
// 				stepName: 'recycle',
// 				commandLineTool: recycleClt,
// 				inputs: {
// 					groupBy: 'r',
// 					collectionRegex: 'p{tt}_x{xx}_y{yy}_r{rr}_c{cc}.ome.tif',
// 					stitchRegex: 'p{tt}_x{xx}_y{yy}_r{rr}_c{cc}.ome.tif',
// 					stitchDir: 'montage/montageOut',
// 					collectionDir: 'data/images',
// 					outDir: 'data/recycle',
// 				},
// 				outputs: {
// 					recycleOut: '',
// 					recycleStdOut: '',
// 					recycleStdErr: '',
// 				},
// 			}),
// 			new Job({
// 				driver: workflow.driver,
// 				workflowId: workflow.name,
// 				dateCreated: '2021-08-13T17:33:02.327Z',
// 				status: 'PENDING',
// 				stepName: 'assemble',
// 				commandLineTool: assembleClt,
// 				inputs: {
// 					stitchPath: 'recycle/recycleOut',
// 					imgPath: 'data/images',
// 					timesliceNaming: false,
// 					output: 'data/assemble',
// 				},
// 				outputs: {
// 					assembleOut: '',
// 					assembleStdOut: '',
// 					assembleStdErr: '',
// 				},
// 			}),
// 		];
// 		const workflowModel = new Workflow(workflow);
// 		const test = await workflowToJobs(workflowModel, cwlJobInputs(workflowModel));
// 		expect(test).to.be.eql(expectedValue);
// 	});
// });
