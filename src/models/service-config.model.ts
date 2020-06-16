import { Entity, model, property } from '@loopback/repository';

@model({
    name: 'drivers',
    settings: { strict: false },
})
export class ServiceConfig extends Entity {
    @property({ type: 'number', id: true, generated: true, }) id?: string;

    @property({ type: 'string' }) title: string;

    @property({ type: 'string' }) url: string;

    @property({ type: 'string' }) port: string;

    @property({ type: 'string' }) user: string;

    @property({ type: 'string' }) password: string;


    constructor(data?: Partial<ServiceConfig>) {
        super(data);
    }
}

export interface ServiceConfigRelations {
    // describe navigational properties here
}

export type ServiceConfigWithRelations = ServiceConfig & ServiceConfigRelations;
