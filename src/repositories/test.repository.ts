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

  public getType(configurationName: string) {
    const drivers = this.config.drivers as Dictionary<DriverManifest>;

    if (!drivers[configurationName]) throw new Error(`Driver configuration ${configurationName} was not found`);

    const manifest = drivers[configurationName];
    const driverType = manifest.type;
    const driverConfig = manifest.config;
    const driver = this.driverFactory.getInstance(driverType, driverConfig);
    return driver.getType();
  }
}
