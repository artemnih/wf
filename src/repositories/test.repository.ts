import { inject } from '@loopback/core';
import { ComputeApiBindings } from '../keys';
import { DriverFactory } from '../factories/driver.factory';

export class TestRepository {
  constructor(@inject(ComputeApiBindings.DRVIER_FACTORY) private driverFactory: DriverFactory) {}

  public getType(manifestName: string) {
    const driver = this.driverFactory.getInstance(manifestName);
    return driver.getType();
  }
}
