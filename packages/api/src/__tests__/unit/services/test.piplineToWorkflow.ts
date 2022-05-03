/* eslint-disable @typescript-eslint/no-misused-promises */
import { Workflow } from '../../../models';
import { pipelineToWorkflow } from '../../../services/pipelineToWorkflow';
import { expect, StubbedInstanceWithSinonAccessor, createStubInstance } from '@loopback/testlab';
import { PipelineRepository } from '../../../repositories';

describe('Pipeline to Workflow Conversion', () => {
  let pipelineRepository: StubbedInstanceWithSinonAccessor<PipelineRepository>;
  beforeEach(givenStubbedRepository);
  it('sleep workflow with no pipeline', async () => {
    const sleepWorkflow = new Workflow({
      name: 'sleep-cwl',
      driver: 'cwl',
      status: 'SUBMITTED',
      inputs: {
        sleepParam: 'string',
      },
      outputs: {},
      cwlJobInputs: {
        sleepParam: '100',
      },
      steps: {
        sleep: {
          run: 'plugin:618020c9b5eb007f68bb6a64',
          in: {
            sleepParam: 'sleepParam',
          },
          out: [],
        },
      },
    });
    const actual = await pipelineToWorkflow(sleepWorkflow, pipelineRepository);
    expect(actual).to.be.eql(sleepWorkflow);
  });
  it('sleep Pipeline to Workflow Test', async () => {
    const sleepPipeline = new Workflow({
      id: '619e5c4da004a6cd3f33cb74',
      name: 'sleep',
      inputs: {
        sleepParam: 'string',
      },
      outputs: {},
      steps: {
        sleep: {
          run: 'pipeline:src/__tests__/data/Pipeline/sleep.json',
          in: {
            sleepParam: 'sleepParam',
          },
          out: [],
        },
      },
    });
    const actual = await pipelineToWorkflow(sleepPipeline, pipelineRepository);
    expect(actual).to.be.eql(
      new Workflow({
        id: '619e5c4da004a6cd3f33cb74',
        name: 'sleep',
        inputs: {
          sleepParam: 'string',
        },
        outputs: {},
        steps: {
          sleep: {
            run: 'plugin:618020c9b5eb007f68bb6a64',
            in: {
              sleepParam: 'sleepParam',
            },
            out: [],
          },
        },
      }),
    );
  });
  it('montage-recycle pipeline to Workflow Test', async () => {
    const montageRecycle = new Workflow({
      id: '619e5c4da004a6cd3f33cb74',
      name: 'montage-recycle-argo',
      inputs: {
        montageFilePattern: 'string',
        montageInpDir: 'Directory',
        montageLayout: 'string[]',
        montageOutputName: 'Directory',
        recycleGroupBy: 'string',
        recycleCollectionRegex: 'string',
        recycleOutputName: 'Directory',
      },
      outputs: {
        recycleoutDir: {
          type: 'Directory',
          outputSource: 'recycle/recycleOut',
        },
        recycleStdErr: {
          type: 'File',
          outputSource: 'recycle/recycleStdErr',
        },
        recycleStdOut: {
          type: 'File',
          outputSource: 'recycle/recycleStdOut',
        },
        montageoutDir: {
          type: 'Directory',
          outputSource: 'montage/montageOut',
        },
        montageStdErr: {
          type: 'File',
          outputSource: 'montage/montageStdErr',
        },
        montageStdOut: {
          type: 'File',
          outputSource: 'montage/montageStdOut',
        },
      },
      cwlJobInputs: {
        montageFilePattern: '{yyy}{xxx}-{r}-001.ome.tif',
        montageInpDir: {
          class: 'Directory',
          path: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
        },
        montageLayout: 'r,xy',
        montageOutputName: {
          class: 'Directory',
          path: '/data/outputs/montage',
        },
        recycleCollectionRegex: '{yyy}{xxx}-{r}-00{c}.ome.tif',
        recycleCollectionDir: {
          class: 'Directory',
          path: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
        },
        recycleGroupBy: 'xyr',
        recycleOutputName: {
          class: 'Directory',
          path: '/data/outputs/recycle',
        },
      },

      steps: {
        'montage-recycle': {
          run: 'pipeline:src/__tests__/data/Pipeline/montage-recycle.json',
          in: {
            filePattern: 'montageFilePattern',
            inpDir: 'montageInpDir',
            layout: 'montageLayout',
            montageoutDir: 'montageOutputName',
            groupBy: 'recycleGroupBy',
            collectionRegex: 'recycleCollectionRegex',
            stitchRegex: 'recycleCollectionRegex',
            stitchDir: 'montage/montageoutDir',
            collectionDir: 'montageInpDir',
            recycleoutDir: 'recycleOutputName',
          },
          out: ['montageoutDir', 'montageStdOut', 'montageStdErr', 'recycleoutDir', 'recycleStdOut', 'recycleStdErr'],
        },
      },
    });
    const actual = await pipelineToWorkflow(montageRecycle, pipelineRepository);
    expect(actual).to.be.eql(
      new Workflow({
        id: '619e5c4da004a6cd3f33cb74',
        name: 'montage-recycle-argo',
        inputs: {
          montageFilePattern: 'string',
          montageInpDir: 'Directory',
          montageLayout: 'string[]',
          montageOutputName: 'Directory',
          recycleGroupBy: 'string',
          recycleCollectionRegex: 'string',
          recycleOutputName: 'Directory',
        },
        outputs: {
          recycleoutDir: {
            type: 'Directory',
            outputSource: 'recycle/recycleOut',
          },
          recycleStdErr: {
            type: 'File',
            outputSource: 'recycle/recycleStdErr',
          },
          recycleStdOut: {
            type: 'File',
            outputSource: 'recycle/recycleStdOut',
          },
          montageoutDir: {
            type: 'Directory',
            outputSource: 'montage/montageOut',
          },
          montageStdErr: {
            type: 'File',
            outputSource: 'montage/montageStdErr',
          },
          montageStdOut: {
            type: 'File',
            outputSource: 'montage/montageStdOut',
          },
        },
        cwlJobInputs: {
          montageFilePattern: '{yyy}{xxx}-{r}-001.ome.tif',
          montageInpDir: {
            class: 'Directory',
            path: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
          },
          montageLayout: 'r,xy',
          montageOutputName: {
            class: 'Directory',
            path: '/data/outputs/montage',
          },
          recycleCollectionRegex: '{yyy}{xxx}-{r}-00{c}.ome.tif',
          recycleCollectionDir: {
            class: 'Directory',
            path: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
          },
          recycleGroupBy: 'xyr',
          recycleOutputName: {
            class: 'Directory',
            path: '/data/outputs/recycle',
          },
        },
        steps: {
          montage: {
            run: 'plugin:612fc61ba21dcd5b4f2abbe1',
            in: {
              filePattern: 'montageFilePattern',
              inpDir: 'montageInpDir',
              layout: 'montageLayout',
              outDir: 'montageOutputName',
            },
            out: ['montageoutDir', 'montageStdOut', 'montageStdErr'],
          },
          recycle: {
            run: 'plugin:612fc674a21dcd5b4f2abbe2',
            in: {
              groupBy: 'recycleGroupBy',
              collectionRegex: 'recycleCollectionRegex',
              stitchRegex: 'recycleCollectionRegex',
              stitchDir: 'montage/montageoutDir',
              collectionDir: 'montageInpDir',
              outDir: 'recycleOutputName',
            },
            out: ['recycleoutDir', 'recycleStdOut', 'recycleStdErr'],
          },
        },
      }),
    );
  });
  it('montage-recycle-sleep 2 templates', async () => {
    const multipleTemplates = new Workflow({
      id: '619e5c4da004a6cd3f33cb74',
      name: 'montage-recycle-sleep',
      inputs: {
        sleepParam: 'string',
        montageFilePattern: 'string',
        montageInpDir: 'Directory',
        montageLayout: 'string[]',
        montageOutputName: 'Directory',
        recycleGroupBy: 'string',
        recycleCollectionRegex: 'string',
        recycleOutputName: 'Directory',
      },
      outputs: {
        recycleoutDir: {
          type: 'Directory',
          outputSource: 'recycle/recycleOut',
        },
        recycleStdErr: {
          type: 'File',
          outputSource: 'recycle/recycleStdErr',
        },
        recycleStdOut: {
          type: 'File',
          outputSource: 'recycle/recycleStdOut',
        },
        montageoutDir: {
          type: 'Directory',
          outputSource: 'montage/montageOut',
        },
        montageStdErr: {
          type: 'File',
          outputSource: 'montage/montageStdErr',
        },
        montageStdOut: {
          type: 'File',
          outputSource: 'montage/montageStdOut',
        },
      },
      steps: {
        sleep: {
          run: 'pipeline:src/__tests__/data/Pipeline/sleep.json',
          in: {
            sleepParam: 'sleepParam',
          },
          out: [],
        },
        'montage-recycle': {
          run: 'pipeline:src/__tests__/data/Pipeline/montage-recycle.json',
          in: {
            filePattern: 'montageFilePattern',
            inpDir: 'montageInpDir',
            layout: 'montageLayout',
            montageoutDir: 'montageOutputName',
            groupBy: 'recycleGroupBy',
            collectionRegex: 'recycleCollectionRegex',
            stitchRegex: 'recycleCollectionRegex',
            stitchDir: 'montage/montageoutDir',
            collectionDir: 'montageInpDir',
            recycleoutDir: 'recycleOutputName',
          },
          out: ['montageoutDir', 'montageStdOut', 'montageStdErr', 'recycleoutDir', 'recycleStdOut', 'recycleStdErr'],
        },
      },
    });
    const actual = await pipelineToWorkflow(multipleTemplates, pipelineRepository);
    expect(actual).to.be.eql(
      new Workflow({
        id: '619e5c4da004a6cd3f33cb74',
        name: 'montage-recycle-sleep',

        inputs: {
          sleepParam: 'string',

          montageFilePattern: 'string',
          montageInpDir: 'Directory',
          montageLayout: 'string[]',
          montageOutputName: 'Directory',
          recycleGroupBy: 'string',
          recycleCollectionRegex: 'string',
          recycleOutputName: 'Directory',
        },
        outputs: {
          recycleoutDir: {
            type: 'Directory',
            outputSource: 'recycle/recycleOut',
          },
          recycleStdErr: {
            type: 'File',
            outputSource: 'recycle/recycleStdErr',
          },
          recycleStdOut: {
            type: 'File',
            outputSource: 'recycle/recycleStdOut',
          },
          montageoutDir: {
            type: 'Directory',
            outputSource: 'montage/montageOut',
          },
          montageStdErr: {
            type: 'File',
            outputSource: 'montage/montageStdErr',
          },
          montageStdOut: {
            type: 'File',
            outputSource: 'montage/montageStdOut',
          },
        },
        steps: {
          sleep: {
            run: 'plugin:618020c9b5eb007f68bb6a64',
            in: {
              sleepParam: 'sleepParam',
            },
            out: [],
          },
          montage: {
            run: 'plugin:612fc61ba21dcd5b4f2abbe1',
            in: {
              filePattern: 'montageFilePattern',
              inpDir: 'montageInpDir',
              layout: 'montageLayout',
              outDir: 'montageOutputName',
            },
            out: ['montageoutDir', 'montageStdOut', 'montageStdErr'],
          },
          recycle: {
            run: 'plugin:612fc674a21dcd5b4f2abbe2',
            in: {
              groupBy: 'recycleGroupBy',
              collectionRegex: 'recycleCollectionRegex',
              stitchRegex: 'recycleCollectionRegex',
              stitchDir: 'montage/montageoutDir',
              collectionDir: 'montageInpDir',
              outDir: 'recycleOutputName',
            },
            out: ['recycleoutDir', 'recycleStdOut', 'recycleStdErr'],
          },
        },
      }),
    );
  });
  it('montage-recycle-sleep 1 template 1 plugin', async () => {
    const multipleTemplates = new Workflow({
      id: '619e5c4da004a6cd3f33cb74',
      name: 'montage-recycle-sleep',
      inputs: {
        sleepParam: 'string',
        montageFilePattern: 'string',
        montageInpDir: 'Directory',
        montageLayout: 'string[]',
        montageOutputName: 'Directory',
        recycleGroupBy: 'string',
        recycleCollectionRegex: 'string',
        recycleOutputName: 'Directory',
      },
      outputs: {
        recycleoutDir: {
          type: 'Directory',
          outputSource: 'recycle/recycleOut',
        },
        recycleStdErr: {
          type: 'File',
          outputSource: 'recycle/recycleStdErr',
        },
        recycleStdOut: {
          type: 'File',
          outputSource: 'recycle/recycleStdOut',
        },
        montageoutDir: {
          type: 'Directory',
          outputSource: 'montage/montageOut',
        },
        montageStdErr: {
          type: 'File',
          outputSource: 'montage/montageStdErr',
        },
        montageStdOut: {
          type: 'File',
          outputSource: 'montage/montageStdOut',
        },
      },
      steps: {
        sleep: {
          run: 'plugin:618020c9b5eb007f68bb6a64',
          in: {
            sleepParam: 'sleepParam',
          },
          out: [],
        },
        'montage-recycle': {
          run: 'pipeline:src/__tests__/data/Pipeline/montage-recycle.json',
          in: {
            filePattern: 'montageFilePattern',
            inpDir: 'montageInpDir',
            layout: 'montageLayout',
            montageoutDir: 'montageOutputName',
            groupBy: 'recycleGroupBy',
            collectionRegex: 'recycleCollectionRegex',
            stitchRegex: 'recycleCollectionRegex',
            stitchDir: 'montage/montageoutDir',
            collectionDir: 'montageInpDir',
            recycleoutDir: 'recycleOutputName',
          },
          out: ['montageoutDir', 'montageStdOut', 'montageStdErr', 'recycleoutDir', 'recycleStdOut', 'recycleStdErr'],
        },
      },
    });
    const actual = await pipelineToWorkflow(multipleTemplates, pipelineRepository);
    expect(actual).to.be.eql(
      new Workflow({
        id: '619e5c4da004a6cd3f33cb74',
        name: 'montage-recycle-sleep',

        inputs: {
          sleepParam: 'string',

          montageFilePattern: 'string',
          montageInpDir: 'Directory',
          montageLayout: 'string[]',
          montageOutputName: 'Directory',
          recycleGroupBy: 'string',
          recycleCollectionRegex: 'string',
          recycleOutputName: 'Directory',
        },
        outputs: {
          recycleoutDir: {
            type: 'Directory',
            outputSource: 'recycle/recycleOut',
          },
          recycleStdErr: {
            type: 'File',
            outputSource: 'recycle/recycleStdErr',
          },
          recycleStdOut: {
            type: 'File',
            outputSource: 'recycle/recycleStdOut',
          },
          montageoutDir: {
            type: 'Directory',
            outputSource: 'montage/montageOut',
          },
          montageStdErr: {
            type: 'File',
            outputSource: 'montage/montageStdErr',
          },
          montageStdOut: {
            type: 'File',
            outputSource: 'montage/montageStdOut',
          },
        },
        steps: {
          sleep: {
            run: 'plugin:618020c9b5eb007f68bb6a64',
            in: {
              sleepParam: 'sleepParam',
            },
            out: [],
          },
          montage: {
            run: 'plugin:612fc61ba21dcd5b4f2abbe1',
            in: {
              filePattern: 'montageFilePattern',
              inpDir: 'montageInpDir',
              layout: 'montageLayout',
              outDir: 'montageOutputName',
            },
            out: ['montageoutDir', 'montageStdOut', 'montageStdErr'],
          },
          recycle: {
            run: 'plugin:612fc674a21dcd5b4f2abbe2',
            in: {
              groupBy: 'recycleGroupBy',
              collectionRegex: 'recycleCollectionRegex',
              stitchRegex: 'recycleCollectionRegex',
              stitchDir: 'montage/montageoutDir',
              collectionDir: 'montageInpDir',
              outDir: 'recycleOutputName',
            },
            out: ['recycleoutDir', 'recycleStdOut', 'recycleStdErr'],
          },
        },
      }),
    );
  });
  function givenStubbedRepository() {
    pipelineRepository = createStubInstance(PipelineRepository);
  }
});
