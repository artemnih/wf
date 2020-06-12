import { inject } from '@loopback/core';
import { ComputeApiBindings } from '../keys';
import { DriverFactory } from '../factories/driver.factory';
// import { PackageManager } from '../utils/package-manager'; // uncomment if using dynamic npm install

export class TestRepository {
  constructor(@inject(ComputeApiBindings.DRVIER_FACTORY) private driverFactory: DriverFactory) {}

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
