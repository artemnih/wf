import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class Job extends Entity {
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
    required: true,
  })
  workflowId: string;

  @property({
    type: 'string',
    required: true,
  })
  driver: string;

  @property({
    type: 'string',
    required: true,
  })
  stepName: string;

  @property({
    type: 'object',
    required: true,
  })
  commandLineTool: object;

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
    type: 'string',
    default: 'PENDING',
  })
  status: string;

  @property({
    type: 'date',
  })
  dateCreated: string;
  
  @property({
    type: 'date',
  })
  dateFinished: string;

  @property({
    type: 'string',
  })
  owner?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Job>) {
    super(data);
  }
}

export interface JobRelations {
  // describe navigational properties here
}

export type JobWithRelations = Job & JobRelations;
