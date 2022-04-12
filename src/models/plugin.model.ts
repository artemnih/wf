import { Entity, model, property } from '@loopback/repository';
@model({ settings: { strict: false, strictObjectIDCoercion: true } })
export class Plugin extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {
      dataType: 'ObjectID', // or perhaps 'objectid'?
    },
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
  })
  cwlId?: string;

  @property({
    type: 'string',
    required: false,
  })
  name?: string;

  @property({
    type: 'string',
    required: false,
  })
  version?: string;

  @property({
    type: 'string',
    required: false,
  })
  title?: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'string',
    required: false,
  })
  containerId?: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: false,
  })
  inputs?: object[];

  @property({
    type: 'array',
    itemType: 'object',
    required: false,
  })
  outputs?: object[];

  @property({
    type: 'boolean',
    required: false,
  })
  customInputs?: boolean;

  @property({
    type: 'array',
    itemType: 'object',
    required: false,
  })
  ui?: object[];

  @property({
    type: 'string',
    required: false,
  })
  author?: string;

  @property({
    type: 'string',
    required: false,
  })
  institution?: string;

  @property({
    type: 'string',
    required: false,
  })
  website?: string;

  @property({
    type: 'string',
    required: false,
  })
  citation?: string;

  @property({
    type: 'string',
    required: false,
  })
  repository?: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: false,
  })
  baseCommand?: string[];

  @property({
    type: 'string',
    required: false,
  })
  stdout?: string;

  @property({
    type: 'string',
    required: false,
  })
  stderr?: string;

  @property({
    type: 'object',
    required: false,
  })
  pluginHardwareRequirements?: object;

  // raw object file from CWL.
  @property({
    type: 'object',
    required: false,
  })
  cwlScript?: object;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Plugin>) {
    super(data);
  }
}

export interface PluginRelations {
  // describe navigational properties here
}

export type ScriptsWithRelations = Plugin & PluginRelations;
