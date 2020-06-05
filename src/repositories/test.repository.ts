import { inject, ApplicationConfig } from '@loopback/core';
import { ComputeApiBindings } from '../keys';
import { DriverFactory } from '../factories/driver.factory';

export class TestRepository {
  constructor(@inject(ComputeApiBindings.DRVIER_FACTORY) private driverFactory: DriverFactory, @inject(ComputeApiBindings.CONFIG) config: ApplicationConfig) {}

  public getType(driverType: string) {
    const driver = this.driverFactory.getInstance(driverType);
    return driver.getType();
  }
}
