import { inject } from '@loopback/core';
import { ComputeApiBindings } from '../keys';
import { DriverFactory } from '../factories/driver.factory';
import { ServiceConfigRepository } from './service-config.repository';
import { repository, WhereBuilder } from '@loopback/repository';
import { Utilities } from '../utils/utilities';
import { ServiceConfig } from '../models/service-config.model';
import { ComputeHttpService } from '../services/compute-http.service';
// import { PackageManager } from '../utils/package-manager'; // uncomment if using dynamic npm install

export class DriverRepository {
  constructor(
    @inject(ComputeApiBindings.DRVIER_FACTORY) private driverFactory: DriverFactory,
    @repository(ServiceConfigRepository) private serviceConfigRepository: ServiceConfigRepository,
  ) {}

  public async compute(serviceName: string, script: string) {
    // avoid hardcoding `user` property name
    const userPropName = Utilities.getPropertyName(ServiceConfig).title;

    // build where query
    const where = new WhereBuilder().eq(userPropName, serviceName).build();

    // find record
    const serviceConfig = await this.serviceConfigRepository.findOne({ where: where });

    // todo: throw 403 if no permissoins were found
    if (!serviceConfig) throw new Error(`Configuration with name ${serviceName} was not found`);
    console.log(serviceConfig);

    const srv = new ComputeHttpService(serviceConfig);
    const result = await srv.compute('test');
    console.log('finish compute', result);
  }

  public async getDriverName(manifestName: string) {
    /* The following code is an example implementation of installing npm packages dynamicically during runtime 

        const packageName = "artem-test-app";
        try {
            const { TestClass } = require(packageName);
            const instance = new TestClass();
            instance.doWork();
        }
        catch (e) {
            console.log(e);
            console.log(e.message);

            if (e.message === `Cannot find module '${packageName}'`) {
                console.log('installing missing dep')
                await PackageManager.install('../artem-test-app');
                console.log('finished installing missing dep')
            }
            console.log('failed to do work')
        }
        */

    const driver = this.driverFactory.getInstance(manifestName);
    return driver.getName();
  }
}
