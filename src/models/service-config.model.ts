import { Entity, model, property } from '@loopback/repository';

@model({
  name: 'drivers',
  settings: { strict: false },
})
export class ServiceConfig extends Entity {
  @property({ type: 'number', id: true, generated: true }) id?: string;
  @property({ type: 'string' }) title: string;
  @property({ type: 'string' }) package: string;
  @property({ type: 'object' }) config: object;
  
  constructor(data?: Partial<ServiceConfig>) {
    super(data);
  }
}
