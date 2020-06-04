import { BindingKey } from '@loopback/context';
import { Driver as DriverModel } from './shared/driver';

export namespace ComputeApiBindings {
  export const CONFIG = BindingKey.create<object>('Compute.config');
}

export namespace DriverBindings {
  export const Driver = BindingKey.create<DriverModel>('Compute.Driver');
}
