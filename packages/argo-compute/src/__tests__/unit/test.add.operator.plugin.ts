import {addOperatorPlugin, scriptsFromWorkflow} from '../../services/CWLToArgo';
import {expect} from '@loopback/testlab';
import {readScriptJson} from './test.cwl.script';
import {CwlWorkflow, MinimalJob} from '../../types';
const helloWorld1 = 'src/__tests__/data/CLT/echo.json';
const ome2zarr = 'src/__tests__/data/CLT/ometozarr.json';
const argoOperator = 'src/operators/argo-file-pattern-operator.json';
const pluginGen = 'src/__tests__/data/CLT/plugin-generator-argo.json';

describe('AddOperatorPlugin', () => {
  it('Add Operator no scatter', () => {
    const helloWorld1Workflow = {
      cwlVersion: 'v1.0',
      class: 'Workflow',
      id: 'hello-world-1',
      inputs: {hello1: 'string'},
      outputs: {},
      steps: {
        step: {
          run: helloWorld1,
          in: {hello: 'hello1'},
          out: [],
        },
      },
    };
    const helloWorldJobs: MinimalJob[] = [
      {
        id: 'hello-world-1',
        workflowId: 'hello-world-1',
        commandLineTool: readScriptJson(helloWorld1),
        inputs: {hello: 'hello test1'},
        outputs: {},
        stepName: 'hello-world-1',
      },
    ];
    const cwlScriptInAndOut = scriptsFromWorkflow(
      helloWorld1Workflow,
      helloWorldJobs,
    );
    expect(
      addOperatorPlugin(helloWorld1Workflow, cwlScriptInAndOut, helloWorldJobs),
    ).to.be.eql({
      cwlWorkflow: helloWorld1Workflow,
      cwlScriptInAndOut,
      jobs: helloWorldJobs,
    });
  });
  it('Add Operator scatter but not dynamic', () => {
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
    const initialJobs: MinimalJob[] = [
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
    const scripts = scriptsFromWorkflow(omezarr, initialJobs);
    expect(addOperatorPlugin(omezarr, scripts, initialJobs)).to.be.eql({
      cwlWorkflow: omezarr,
      cwlScriptInAndOut: scripts,
      jobs: initialJobs,
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
        patternGenerator: {
          run: 'plugin:6206a0b5bd104b0010050abd',
          in: {
            inpDir: 'file-pattern-input',
            pattern: 'pattern',
            outDir: 'file-pattern-output',
            chunkSize: 'chunkSize',
          },
          out: ['filePatternsoutDir'],
        },
        ome2zarr: {
          run: 'plugin:61ae7a98f7ab3a5033f3390b',
          scatter: 'filePattern',
          in: {
            filePattern: 'patternGenerator/filePatternsoutDir',
            inpDir: 'inpDir',
            outDir: 'outDir',
          },
          out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
        },
      },
    };
    const initialJobs: MinimalJob[] = [
      {
        id: 'file-gen',
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
          filePatterns: {},
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
    ];
    const scripts = scriptsFromWorkflow(dynamicScatter, initialJobs);
    const jobs = [
      ...initialJobs,
      {
        id: 'argoFileOperator',
        workflowId: 'blah',
        commandLineTool: readScriptJson(argoOperator),
        inputs: {input: 'patternGenerator/filePatternsoutDir'},
        outputs: {},
        stepName: 'argoFileOperator',
      },
    ];
    const expectedScripts = [
      ...scripts,
      {
        cwlScript: readScriptJson(argoOperator),
        in: {input: 'patternGenerator/filePatternsoutDir'},
        out: ['filePatterns'],
      },
    ];
    const operatorReturn = addOperatorPlugin(
      dynamicScatter,
      scripts,
      initialJobs,
    );

    const expectedSteps = {
      argoFileOperator: {
        run: 'src/operators/argo-file-pattern-operator.json',
        in: {
          input: 'patternGenerator/filePatternsoutDir',
        },
        out: ['filePatterns'],
      },
      patternGenerator: {
        run: 'plugin:6206a0b5bd104b0010050abd',
        in: {
          inpDir: 'file-pattern-input',
          pattern: 'pattern',
          outDir: 'file-pattern-output',
          chunkSize: 'chunkSize',
        },
        out: ['filePatternsoutDir'],
      },
      ome2zarr: {
        run: 'plugin:61ae7a98f7ab3a5033f3390b',
        scatter: 'filePattern',
        in: {
          filePattern: 'argoFileOperator/filePatterns',
          inpDir: 'inpDir',
          outDir: 'outDir',
        },
        out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
      },
    };
    expect(operatorReturn.cwlWorkflow.steps).to.be.eql(expectedSteps);
    expect(operatorReturn).to.be.eql({
      cwlWorkflow: operatorReturn.cwlWorkflow,
      cwlScriptInAndOut: expectedScripts,
      jobs,
    });
  });
  it('dynamic scatter two step', () => {
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
            filePattern: 'filepattern/filepatternoutDir',
            inpDir: 'inpDir',
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
          out: ['filePatternsoutDir'],
        },
        ome2zarr2: {
          run: 'plugin:61ae7a98f7ab3a5033f3390b',
          scatter: 'filePattern',
          in: {
            filePattern: 'filepattern2/filepatternoutDir',
            inpDir: 'inpDir',
            outDir: 'outDir',
          },
          out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
        },
      },
    };
    const initialJobs: MinimalJob[] = [
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
          filePatterns: {},
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
          filePatterns: {},
        },
        stepName: 'file-gen',
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
        stepName: 'omezarr.1',
      },
    ];
    const scripts = scriptsFromWorkflow(dynamicScatter, initialJobs);
    const jobs = [
      ...initialJobs,
      {
        id: 'argoFileOperator',
        workflowId: 'blah',
        commandLineTool: readScriptJson(argoOperator),
        inputs: {input: 'filepattern/filepatternoutDir'},
        outputs: {},
        stepName: 'argoFileOperator',
      },
      {
        id: 'argoFileOperator-2',
        workflowId: 'blah',
        commandLineTool: readScriptJson(argoOperator),
        inputs: {input: 'filepattern2/filepatternoutDir'},
        outputs: {},
        stepName: 'argoFileOperator-2',
      },
    ];
    const expectedScripts = [
      ...scripts,
      {
        cwlScript: readScriptJson(argoOperator),
        in: {input: 'filepattern/filepatternoutDir'},
        out: ['filePatterns'],
      },
      {
        cwlScript: readScriptJson(argoOperator),
        in: {input: 'filepattern2/filepatternoutDir'},
        out: ['filePatterns'],
      },
    ];
    const operatorReturn = addOperatorPlugin(
      dynamicScatter,
      scripts,
      initialJobs,
    );

    const expectedSteps = {
      argoFileOperator: {
        run: 'src/operators/argo-file-pattern-operator.json',
        in: {
          input: 'filepattern/filepatternoutDir',
        },
        out: ['filePatterns'],
      },
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
          filePattern: 'argoFileOperator/filePatterns',
          inpDir: 'inpDir',
          outDir: 'outDir',
        },
        out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
      },
      'argoFileOperator-2': {
        run: 'src/operators/argo-file-pattern-operator.json',
        in: {
          input: 'filepattern2/filepatternoutDir',
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
        out: ['filePatternsoutDir'],
      },
      ome2zarr2: {
        run: 'plugin:61ae7a98f7ab3a5033f3390b',
        scatter: 'filePattern',
        in: {
          filePattern: 'argoFileOperator-2/filePatterns',
          inpDir: 'inpDir',
          outDir: 'outDir',
        },
        out: ['ome2zarroutDir', 'ome2zarrStdOut', 'ome2zarrStdErr'],
      },
    };
    expect(operatorReturn.cwlWorkflow.steps).to.be.eql(expectedSteps);
    expect(operatorReturn.cwlScriptInAndOut).to.be.eql(expectedScripts);
    expect(operatorReturn.jobs).to.be.eql(jobs);
  });
});
