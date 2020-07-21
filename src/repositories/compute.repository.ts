import { inject } from '@loopback/core';
import { ComputeApiBindings } from '../keys';
import { DriverFactory } from '../factories/driver.factory';
import { ServiceConfig } from '../models/service-config.model';

export class ComputeRepository {
  constructor(@inject(ComputeApiBindings.DRVIER_FACTORY) private driverFactory: DriverFactory) {}

  public async compute(serviceConfig: ServiceConfig, script: string) {
    // const driver = await this.driverFactory.getInstance(serviceConfig);
    console.log('computing.....');
    // await driver.compute(script);
  }

  public async install(serviceConfig: ServiceConfig) {
    console.log('installing.....');
    await this.driverFactory.install(serviceConfig.package);
  }
}
