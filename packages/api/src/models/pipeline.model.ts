import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class Pipeline extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {
      dataType: 'ObjectID', // or perhaps 'objectid'?
    },
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  version: string;
  @property({
    type: 'object',
    required: true,
  })
  inputs: object;

  @property({
    type: 'object',
    required: true,
  })
  outputs: object;

  @property({
    type: 'object',
    required: true,
  })
  steps: object;

  @property({
    type: 'string',
  })
  owner?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Pipeline>) {
    super(data);
  }
}

export interface PipelineRelations {
  // describe navigational properties here
}

export type PipelineWithRelations = Pipeline & PipelineRelations;
