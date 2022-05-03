import { BindingKey } from '@loopback/context';
import { DriverFactory } from './drivers/driver-base';

export namespace ComputeApiBindings {
  export const CONFIG = BindingKey.create<object>('Compute.config');
  export const DRIVER_FACTORY = BindingKey.create<DriverFactory>('Compute.DriverFactory');
}
