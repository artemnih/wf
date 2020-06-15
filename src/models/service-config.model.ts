import { Entity, model, property } from '@loopback/repository';

@model({
  name: 'drivers',
  settings: { strict: false },
})
export class ServiceConfig extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  title?: string;

  constructor(data?: Partial<ServiceConfig>) {
    super(data);
  }
}

export interface ServiceConfigRelations {
  // describe navigational properties here
}

export type ServiceConfigWithRelations = ServiceConfig & ServiceConfigRelations;
