import { BindingKey } from '@loopback/context';
import { Driver } from './shared/driver';

export namespace ComputeApiBindings {
  export const CONFIG = BindingKey.create<any>('Compute.config');
}

export namespace DriverBindings {
  export const Driver = BindingKey.create<Driver>('Compute.Driver');
}

