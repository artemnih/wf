import { DateType, Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class Workflow extends Entity {
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
  name: string;

  @property({
    type: 'string',
  })
  driver?: string;

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
    type: 'object',
    required: true,
  })
  cwlJobInputs: object;

  @property({
    type: 'string',
    default: 'Submitted',
  })
  status: string;

  @property({
    type: 'date',
    default: new DateType().defaultValue().toISOString(),
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

  constructor(data?: Partial<Workflow>) {
    super(data);
  }
}

export interface WorkflowRelations {
  // describe navigational properties here
}

export type WorkflowWithRelations = Workflow & WorkflowRelations;
