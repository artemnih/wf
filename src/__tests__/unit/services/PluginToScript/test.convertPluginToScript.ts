import { convertPluginToCLT } from '../../../../services/PolusToCLT';
import { Plugin } from '../../../../models';
import { expect } from '@loopback/testlab';
import { readFileSync } from 'fs';
describe('PluginToScript Convertor', () => {
  it('Test Hello Tool', () => {
    const echoSchema = JSON.parse(readFileSync('examples/pluginSchema/echo.json', 'utf8')) as Plugin;
    const actual = convertPluginToCLT(new Plugin(echoSchema));
    expect(actual).to.be.eql({
      cwlVersion: 'v1.0',
      namespaces: { CustomResourceRequirement: 'https://polus.org' },
      schemas: ['https://schema.org/version/latest/schemaorg-current-https.rdf'],
      id: 'echo',
      class: 'CommandLineTool',
      'CustomResourceRequirement:gpu': 'none',
      requirements: {
        DockerRequirement: { dockerPull: 'busybox' },
        InlineJavascriptRequirement: {},
        ResourceRequirement: {},
        InitialWorkDirRequirement: { listing: [] },
      },
      baseCommand: ['echo'],
      inputs: {
        message: { type: 'string', inputBinding: { prefix: '--message' } },
      },
      outputs: {
        echoStdOut: { type: 'stdout' },
        echoStdErr: { type: 'stderr' },
      },
    });
  });
  it('threshold conversion', () => {
    const thresholdSchema = JSON.parse(readFileSync('examples/pluginSchema/thresholding-argo.json', 'utf8')) as Plugin;
    const val = convertPluginToCLT(new Plugin(thresholdSchema));
    expect(val).to.be.eql({
      cwlVersion: 'v1.0',
      namespaces: { CustomResourceRequirement: 'https://polus.org' },
      schemas: ['https://schema.org/version/latest/schemaorg-current-https.rdf'],
      id: 'threshold',
      class: 'CommandLineTool',
      'CustomResourceRequirement:gpu': 'none',
      baseCommand: [''],
      requirements: {
        DockerRequirement: { dockerPull: 'wipp/wipp-thresh-plugin:1.1.1' },
        InlineJavascriptRequirement: {},
        ResourceRequirement: {},
        InitialWorkDirRequirement: { listing: [{ entry: '$(inputs.output)', writable: true }] },
      },
      inputs: {
        input: { type: 'Directory', inputBinding: { prefix: '--input' } },
        thresholdtype: { type: 'string', inputBinding: { prefix: '--thresholdtype' } },
        thresholdvalue: { type: 'int?', inputBinding: { prefix: '--thresholdvalue' } },
        output: { type: 'Directory', inputBinding: { prefix: '--output' } },
      },
      outputs: {
        thresholdoutput: { type: 'Directory', outputBinding: { glob: '$(inputs.output.basename)' } },
        thresholdStdOut: { type: 'stdout' },
        thresholdStdErr: { type: 'stderr' },
      },
    });
  });
  it('Montage conversion', () => {
    const montageSchema: Plugin = JSON.parse(readFileSync('examples/pluginSchema/montage.json', 'utf8'));
    const actual = convertPluginToCLT(new Plugin(montageSchema));
    expect(actual).to.be.eql({
      cwlVersion: 'v1.0',
      namespaces: { CustomResourceRequirement: 'https://polus.org' },
      schemas: ['https://schema.org/version/latest/schemaorg-current-https.rdf'],
      id: 'montage',
      class: 'CommandLineTool',
      'CustomResourceRequirement:gpu': 'none',
      requirements: {
        DockerRequirement: { dockerPull: 'kevinpatrickhannon/polus-montage:test' },
        InlineJavascriptRequirement: {},
        ResourceRequirement: {},
        InitialWorkDirRequirement: { listing: [{ entry: '$(inputs.outDir)', writable: true }] },
      },

      baseCommand: ['python3', '/opt/executables/main.py'],
      inputs: {
        filePattern: { type: 'string', inputBinding: { prefix: '--filePattern' } },
        inpDir: { type: 'Directory', inputBinding: { prefix: '--inpDir' } },
        layout: { type: 'string[]?', inputBinding: { prefix: '--layout=', itemSeparator: ',', separate: false } },
        imageSpacing: { type: 'int?', inputBinding: { prefix: '--imageSpacing' } },
        gridSpacing: { type: 'int?', inputBinding: { prefix: '--gridSpacing' } },
        outDir: { type: 'Directory', inputBinding: { prefix: '--outDir' } },
      },
      outputs: {
        montageoutDir: { type: 'Directory', outputBinding: { glob: '$(inputs.outDir.basename)' } },
        montageStdOut: { type: 'stdout' },
        montageStdErr: { type: 'stderr' },
      },
    });
  });
  it('recycle plugin convertor', () => {
    const recycleSchema: Plugin = JSON.parse(readFileSync('examples/pluginSchema/recycle.json', 'utf8'));

    const actual = convertPluginToCLT(new Plugin(recycleSchema));
    expect(actual).to.be.eql({
      cwlVersion: 'v1.0',
      namespaces: { CustomResourceRequirement: 'https://polus.org' },
      schemas: ['https://schema.org/version/latest/schemaorg-current-https.rdf'],
      id: 'recycle',
      class: 'CommandLineTool',
      'CustomResourceRequirement:gpu': 'none',
      requirements: {
        DockerRequirement: { dockerPull: 'kevinpatrickhannon/polus-recycle-vector:test' },
        InlineJavascriptRequirement: {},
        ResourceRequirement: {},
        InitialWorkDirRequirement: { listing: [{ entry: '$(inputs.outDir)', writable: true }] },
      },
      baseCommand: ['python3', '/opt/executables/main.py'],
      inputs: {
        stitchDir: { type: 'Directory', inputBinding: { prefix: '--stitchDir' } },
        collectionDir: { type: 'Directory', inputBinding: { prefix: '--collectionDir' } },
        stitchRegex: { type: 'string', inputBinding: { prefix: '--stitchRegex' } },
        collectionRegex: { type: 'string', inputBinding: { prefix: '--collectionRegex' } },
        groupBy: { type: 'string?', inputBinding: { prefix: '--groupBy' } },
        outDir: { type: 'Directory', inputBinding: { prefix: '--outDir' } },
      },
      outputs: {
        recycleoutDir: { type: 'Directory', outputBinding: { glob: '$(inputs.outDir.basename)' } },
        recycleStdOut: { type: 'stdout' },
        recycleStdErr: { type: 'stderr' },
      },
    });
  });
  it('Tiff to Zarr convertor', () => {
    const tiffZarr: Plugin = JSON.parse(readFileSync('examples/pluginSchema/ome2zarr.json', 'utf8'));
    const actual = convertPluginToCLT(new Plugin(tiffZarr));
    expect(actual).to.be.eql({
      cwlVersion: 'v1.0',
      namespaces: { CustomResourceRequirement: 'https://polus.org' },
      schemas: ['https://schema.org/version/latest/schemaorg-current-https.rdf'],
      id: 'ome2zarr',
      class: 'CommandLineTool',
      'CustomResourceRequirement:gpu': 'none',
      requirements: {
        DockerRequirement: { dockerPull: 'kevinpatrickhannon/polus-ome-zarr-converter-plugin:test1' },
        InlineJavascriptRequirement: {},
        ResourceRequirement: {},
        InitialWorkDirRequirement: { listing: [{ entry: '$(inputs.outDir)', writable: true }] },
      },
      baseCommand: ['python3', '/opt/executables/main.py'],
      inputs: {
        inpDir: { type: 'Directory', inputBinding: { prefix: '--inpDir' } },
        filePattern: { type: 'string', inputBinding: { prefix: '--filePattern' } },
        outDir: { type: 'Directory', inputBinding: { prefix: '--outDir' } },
      },
      outputs: {
        ome2zarroutDir: { type: 'Directory', outputBinding: { glob: '$(inputs.outDir.basename)' } },
        ome2zarrStdOut: { type: 'stdout' },
        ome2zarrStdErr: { type: 'stderr' },
      },
    });
  });
  it('File Pattern Generator', () => {
    const filePattern = JSON.parse(readFileSync('examples/pluginSchema/filePatternGenerator.json', 'utf8')) as Plugin;
    const actual = convertPluginToCLT(new Plugin(filePattern));
    expect(actual).to.be.eql({
      cwlVersion: 'v1.0',
      namespaces: { CustomResourceRequirement: 'https://polus.org' },
      schemas: ['https://schema.org/version/latest/schemaorg-current-https.rdf'],
      id: 'filepattern',
      class: 'CommandLineTool',
      'CustomResourceRequirement:gpu': 'none',
      requirements: {
        DockerRequirement: { dockerPull: 'polusai/filepattern-generator-plugin:0.2.0' },
        InlineJavascriptRequirement: {},
        ResourceRequirement: {},
        InitialWorkDirRequirement: { listing: [{ entry: '$(inputs.outDir)', writable: true }] },
      },
      baseCommand: ['python3', '/opt/executables/main.py'],
      inputs: {
        inpDir: { type: 'Directory', inputBinding: { prefix: '--inpDir' } },
        pattern: { type: 'string?', inputBinding: { prefix: '--pattern' } },
        chunkSize: { type: 'int?', default: 30, inputBinding: { prefix: '--chunkSize' } },
        groupBy: { type: 'string?', inputBinding: { prefix: '--groupBy' } },
        outDir: { type: 'Directory', inputBinding: { prefix: '--outDir' } },
      },
      outputs: {
        'filepatternoutDir': { type: 'Directory', outputBinding: { glob: '$(inputs.outDir.basename)' } },
        'filepatternStdOut': { type: 'stdout' },
        'filepatternStdErr': { type: 'stderr' },
      },
    });
  });
});
