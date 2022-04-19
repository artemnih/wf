import {Entity, model, property} from '@loopback/repository';

@model()
export class Argo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'object',
    required: true,
  })
  cwlWorkflow: object;

  @property({
    type: 'object',
    required: true,
  })
  cwlJobInputs: object;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  jobs: object[];

  constructor(data?: Partial<Argo>) {
    super(data);
  }
}

export interface ArgoRelations {
  // describe navigational properties here
}

export type ArgoWithRelations = Argo & ArgoRelations;
