import { BindingKey } from '@loopback/context';
import { Driver as DriverModel } from './shared/driver';
import { Dictionary } from './shared/types/dictionary';
import { Class } from '@loopback/repository';
import { DriverFactory } from './factories/driver.factory';

export namespace ComputeApiBindings {
  export const CONFIG = BindingKey.create<object>('Compute.config');
  export const DRVIER_FACTORY = BindingKey.create<DriverFactory>('Compute.DriverFactory');
}

