import { Entity, model, property } from '@loopback/repository';
import { MethodMap } from '../types/method-map';

@model({
  name: 'drivers',
  settings: { strict: false },
})
export class ServiceConfig extends Entity {
  @property({ type: 'number', id: true, generated: true }) id?: string;
  @property({ type: 'string' }) title: string;
  @property({ type: 'string' }) url: string;
  @property({ type: 'string' }) port: string;
  @property({ type: 'string' }) user: string;
  @property({ type: 'string' }) password: string;
  @property({ type: 'object' }) methods: MethodMap;

  constructor(data?: Partial<ServiceConfig>) {
    super(data);
  }
}
