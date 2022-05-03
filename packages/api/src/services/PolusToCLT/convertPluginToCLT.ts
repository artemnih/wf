import { Plugin } from '../../models';
import { GpuVendor, PluginHardwareRequirements, PluginInput, PluginOutput } from './PolusComputeSchema';
interface CWLResourceReq {
  ResourceRequirement: {
    [key: string]: number | string | undefined;
    coresMin?: number | string;
    coresMax?: number | string;
    ramMin?: number | string;
    ramMax?: number | string;
    tmpDirMin?: number | string;
    tmpDirMax?: number | string;
    outDirMin?: number | string;
    outDirMax?: number | string;
  };
  CustomResourceRequirement: {
    [key: string]: boolean | string | GpuVendor | number | undefined;
    'CustomResourceRequirement:cpuAVX'?: boolean;
    'CustomResourceRequirement:cpuAVX2'?: boolean;
    'CustomResourceRequirement:cpuMin'?: string;
    'CustomResourceRequirement:gpuVendor'?: GpuVendor;
    'CustomResourceRequirement:gpuType'?: string;
    'CustomResourceRequirement:gpuCount'?: number;
    'CustomResourceRequirement:gpuDriverVersion'?: string;
  };
}
interface OutEntry {
  entry: string;
  writable: boolean;
}
// This interface is a CWL construct to allow writable input directories
interface MappedOutput {
  InitialWorkDirRequirement: {
    listing?: OutEntry[];
  };
  outputs: Record<string, object>;
}
export function convertPluginToCLT(plugin: Plugin): object {
  const hardwareRequirements = convertHardwareReqirements(plugin.pluginHardwareRequirements as PluginHardwareRequirements);
  const outputs = convertOutputs(plugin.outputs as PluginOutput[], `${plugin.name?.toLowerCase()}`);
  const inputs = convertInputs(plugin.inputs as PluginInput[], plugin.outputs as PluginOutput[]);
  return {
    cwlVersion: 'v1.0',
    namespaces: {
      CustomResourceRequirement: 'https://polus.org',
    },
    schemas: ['https://schema.org/version/latest/schemaorg-current-https.rdf'],
    id: plugin.name?.toLowerCase(),
    class: 'CommandLineTool',
    ...hardwareRequirements.CustomResourceRequirement,
    requirements: {
      DockerRequirement: { dockerPull: plugin.containerId },
      InlineJavascriptRequirement: {},
      ResourceRequirement: { ...hardwareRequirements.ResourceRequirement },
      InitialWorkDirRequirement: { ...outputs.InitialWorkDirRequirement },
    },
    baseCommand: plugin.baseCommand ?? [''],
    inputs,
    outputs: { ...outputs.outputs },
  };
}

function convertHardwareReqirements(hardwareReqirements: PluginHardwareRequirements): CWLResourceReq {
  if (hardwareReqirements) {
    const cwlRet: CWLResourceReq = {
      ResourceRequirement: {
        coresMin: hardwareReqirements.coresMin,
        coresMax: hardwareReqirements.coresMax,
        ramMin: hardwareReqirements.ramMin,
        ramMax: hardwareReqirements.ramMax,
        tmpDirMin: hardwareReqirements.tmpDirMin,
        tmpDirMax: hardwareReqirements.tmpDirMax,
        outDirMin: hardwareReqirements.outDirMin,
        outDirMax: hardwareReqirements.outDirMax,
      },
      CustomResourceRequirement: {
        'CustomResourceRequirement:cpuAVX': hardwareReqirements.cpuAVX,
        'CustomResourceRequirement:cpuAVX2': hardwareReqirements.cpuAVX2,
        'CustomResourceRequirement:cpuMin': hardwareReqirements.cpuMin,
        'CustomResourceRequirement:gpuVendor': hardwareReqirements.gpuVendor,
        'CustomResourceRequirement:gpuCount': hardwareReqirements.gpuCount,
        'CustomResourceRequirement:gpuType': hardwareReqirements.gpuType,
        'CustomResourceRequirement:gpuDriverVersion': hardwareReqirements.gpuDriverVersion,
      },
    };

    Object.keys(cwlRet.ResourceRequirement).forEach((key) => (cwlRet.ResourceRequirement[key] === undefined ? delete cwlRet.ResourceRequirement[key] : {}));
    Object.keys(cwlRet.CustomResourceRequirement).forEach((key) =>
      cwlRet.CustomResourceRequirement[key] === undefined ? delete cwlRet.CustomResourceRequirement[key] : {},
    );
    return cwlRet;
  }
  return { ResourceRequirement: {}, CustomResourceRequirement: {} };
}
function convertOutputs(outputs: PluginOutput[], pluginName: string): MappedOutput {
  const outEntryArray: OutEntry[] = [];

  const outputObj: Record<string, object> = {};
  for (const out of outputs) {
    const outName = `$(inputs.${out.name})`;
    outEntryArray.push({ entry: `${outName}`, writable: true });
    const globValue = `$(inputs.${out.name}.basename)`;
    outputObj[`${pluginName}${out.name}`] = { type: 'Directory', outputBinding: { glob: `${globValue}` } };
  }
  outputObj[`${pluginName}StdOut`] = { type: 'stdout' };
  outputObj[`${pluginName}StdErr`] = { type: 'stderr' };
  return { InitialWorkDirRequirement: { listing: outEntryArray }, outputs: { ...outputObj } };
}
function convertInputs(inputs: PluginInput[], outputs: PluginOutput[]) {
  interface InputScript {
    [index: string]: {
      type: string;
      default?: string;
      inputBinding: {
        prefix: string;
        itemSeparator?: string;
        separate?: boolean;
      };
    };
  }
  const inputTypeMap = new Map();
  inputTypeMap.set('0', 'Directory');
  inputTypeMap.set('path', 'Directory');

  inputTypeMap.set('1', 'string');
  inputTypeMap.set('string', 'string');

  inputTypeMap.set('2', 'int');
  inputTypeMap.set('int', 'int');

  inputTypeMap.set('3', 'string[]');
  inputTypeMap.set('string[]', 'string[]');

  inputTypeMap.set('4', 'boolean');
  inputTypeMap.set('boolean', 'boolean');
  const returnObject: InputScript = {};
  inputs.map((value) => {
    let typeVal = inputTypeMap.get(`${value.type.toString()}`);
    if (!typeVal) {
      console.error(`The type of ${value} was not found.`);
      throw Error(`The type of ${value} was not found.`);
    }
    typeVal = value.required ? typeVal : `${typeVal}?`;
    const entry = {
      type: typeVal,
      inputBinding: {
        prefix: `--${value.name}`,
      },
    };
    Object.assign(entry, typeVal.includes('string[]') ? { inputBinding: { prefix: `--${value.name}=`, itemSeparator: ',', separate: false } } : undefined);
    Object.assign(entry, value.default ? { default: value.default } : undefined);

    returnObject[`${value.name}`] = entry;
  });
  outputs.map((value) => {
    const outputEntry = {
      type: inputTypeMap.get(`${value.type.toString()}`),
      inputBinding: {
        prefix: `--${value.name}`,
      },
    };
    returnObject[`${value.name}`] = outputEntry;
  });
  return returnObject;
}
