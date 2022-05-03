import { expect } from '@loopback/testlab';
import { Workflow } from '../../../../models';
import { cwlJobInputs, CwlWorkflowTemplate, workflowToCwl } from '../../../../services/CWLConvertors';

interface ExpectedValue {
  cwlVersion: string;
  class: string;
  id: string;
  inputs: object;
  requirements: object;
  outputs: object;
  steps: object;
}
function testValues(expected: CwlWorkflowTemplate, correct: ExpectedValue) {
  expect(expected.inputs).to.be.eql(correct.inputs);
  expect(expected.outputs).to.be.eql(correct.outputs);
  expect(expected.steps).to.be.eql(correct.steps);
  expect(expected).to.be.eql(correct);
}
describe('WorkflowModel to CwlWorkflow', () => {
  it('echo workflow model converted to Cwl Workflow', () => {
    const expectedValue: ExpectedValue = {
      cwlVersion: 'v1.2',
      class: 'Workflow',
      id: 'hello-world-1',
      requirements: { InlineJavascriptRequirement: {}, ScatterFeatureRequirement: {} },
      inputs: {
        hello1: 'string',
      },
      outputs: {},
      steps: {
        hello1: {
          run: '',
          in: {
            hello1: 'hello kevin',
          },
          out: {},
        },
      },
    };
    const workflow = {
      name: expectedValue.id,
      inputs: { hello1: 'string' },
      outputs: {},
      steps: {
        hello1: {
          run: '',
          in: {
            hello1: 'hello kevin',
          },
          out: {},
        },
      },
    };
    const val = workflowToCwl(new Workflow(workflow));
    testValues(val, expectedValue);
  });
  it('echo workflow with two parameters model converted to Cwl Workflow', () => {
    const expectedValue = {
      cwlVersion: 'v1.2',
      class: 'Workflow',
      id: 'hello-world-2',
      requirements: { InlineJavascriptRequirement: {}, ScatterFeatureRequirement: {} },
      inputs: {
        hello1: 'string',
        hello2: 'string',
      },
      outputs: {},
      steps: {
        hello1: {
          run: '',
          in: {
            hello1: 'hello',
            hello2: 'kevin',
          },
          out: {},
        },
      },
    };
    const workflow = {
      name: expectedValue.id,
      inputs: { hello1: 'string', hello2: 'string' },
      outputs: {},
      steps: {
        hello1: {
          run: '',
          in: {
            hello1: 'hello',
            hello2: 'kevin',
          },
          out: {},
        },
      },
    };
    const val = workflowToCwl(new Workflow(workflow));
    testValues(val, expectedValue);
  });
  it('echo workflow with two steps model converted to Cwl Workflow', () => {
    const expectedValue = {
      cwlVersion: 'v1.2',
      class: 'Workflow',
      id: 'hello-world-two-steps',
      requirements: { InlineJavascriptRequirement: {}, ScatterFeatureRequirement: {} },
      inputs: {
        hello1: 'string',
        hello2: 'string',
        hello3: 'string',
      },
      outputs: {},
      steps: {
        hello1: {
          run: '',
          in: {
            hello1: 'hello1',
          },
          out: {},
        },
        hello2: {
          run: '',
          in: {
            hello2: 'hello2',
            hello3: 'hello3',
          },
          out: {},
        },
      },
    };
    const workflow = {
      name: expectedValue.id,
      inputs: { hello1: 'string', hello2: 'string', hello3: 'string' },
      outputs: {},
      steps: {
        hello1: {
          run: '',
          in: {
            hello1: 'hello1',
          },
          out: {},
        },
        hello2: {
          run: '',
          in: {
            hello2: 'hello2',
            hello3: 'hello3',
          },
          out: {},
        },
      },
    };
    const val = workflowToCwl(new Workflow(workflow));
    testValues(val, expectedValue);
  });
  it('WIPP workflow with three steps', () => {
    const expectedValue = {
      cwlVersion: 'v1.2',
      class: 'Workflow',
      id: 'montage-recycle-assemble',
      requirements: { InlineJavascriptRequirement: {}, ScatterFeatureRequirement: {} },
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
        assembleTimeSliceNaming: 'boolean',
        assembleOutDir: 'Directory',
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
        assembleOut: {
          type: 'Directory',
          outputSource: 'assemble/assembleOut',
        },
      },
      steps: {
        montage: {
          run: '',
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
          run: '',
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
        assemble: {
          run: '',
          in: {
            stitchPath: 'recycle/recycleOut',
            imgPath: 'montageInpDir',
            timesliceNaming: 'assembleTimeSliceNaming',
            output: 'assembleOutDir',
          },
          out: ['assembleOut'],
        },
      },
    };
    const workflow = {
      name: expectedValue.id,
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
        assembleTimeSliceNaming: 'boolean',
        assembleOutDir: 'Directory',
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
        assembleOut: {
          type: 'Directory',
          outputSource: 'assemble/assembleOut',
        },
      },
      cwlJobInputs: {
        montageFilePattern: 'p01_x{xx}_y{yy}_r{rr}_c01.ome.tif',
        montageInpDir: {
          class: 'Directory',
          path: 'data/images/',
        },
        montageLayout: ['r', 'xy'],
        montageImageSpacing: 10,
        montageGridSpacing: 20,
        montageOutputName: {
          class: 'Directory',
          path: 'data/montage',
        },
        recycleCollectionRegex: 'p{tt}_x{xx}_y{yy}_r{rr}_c{cc}.ome.tif',
        recycleStitchDir: {
          class: 'Directory',
          path: 'data/montage',
        },
        recycleCollectionDir: {
          class: 'Directory',
          path: 'data/images',
        },
        recycleGroupBy: 'r',
        recycleOutputName: {
          class: 'Directory',
          path: 'data/recycle',
        },
        assembleTimeSliceNaming: false,
        assembleOutDir: {
          class: 'Directory',
          path: 'data/assemble',
        },
      },
      steps: {
        montage: {
          run: '',
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
          run: '',
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
        assemble: {
          run: '',
          in: {
            stitchPath: 'recycle/recycleOut',
            imgPath: 'montageInpDir',
            timesliceNaming: 'assembleTimeSliceNaming',
            output: 'assembleOutDir',
          },
          out: ['assembleOut'],
        },
      },
    };
    const val = workflowToCwl(new Workflow(workflow));
    testValues(val, expectedValue);
  });
});
describe('Convert CWlJobInputs', () => {
  it('Single parameter', () => {
    const workflow = {
      inputs: { hello1: 'string', hello2: 'string' },
      outputs: {},
      cwlJobInputs: { hello1: 'hello from kevin' },
      steps: {},
    };

    const jobInputs = cwlJobInputs(new Workflow(workflow));
    expect(jobInputs).to.be.eql({ hello1: 'hello from kevin' });
  });
});
