import { BindingKey } from '@loopback/context';
import { DriverFactory } from './factories/driver.factory';

export namespace ComputeApiBindings {
  export const CONFIG = BindingKey.create<object>('Compute.config');
  export const DRIVER_FACTORY = BindingKey.create<DriverFactory>('Compute.DriverFactory');
}
