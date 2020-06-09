import { inject, ApplicationConfig } from '@loopback/core';
import { ComputeApiBindings } from '../keys';
import { DriverFactory } from '../factories/driver.factory';
import { Dictionary } from '../shared/dictionary';
import { DriverManifest } from '../shared/driver-manifest';

export class TestRepository {
  constructor(
    @inject(ComputeApiBindings.DRVIER_FACTORY) private driverFactory: DriverFactory,
    @inject(ComputeApiBindings.CONFIG) private config: ApplicationConfig,
  ) {}

  public getType(manifestName: string) {
    const driver = this.driverFactory.getInstance(manifestName);
    return driver.getType();
  }
}
