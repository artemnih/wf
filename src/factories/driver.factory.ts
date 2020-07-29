import { PackageManager } from '../utils/package-manager';
import { ServiceConfig } from '../models/service-config.model';
import { Driver } from '../types/driver';

export class DriverFactory {

  public async getInstance(serviceConfig: ServiceConfig, allowInstallAndRetry = true): Promise<Driver | undefined> {
    const packageName = serviceConfig.package;
    try {
      const DriverClass = (await import(packageName)).default;
      return new DriverClass(serviceConfig.config) as Driver;
    } catch (e) {
      if (e.message === `Cannot find module '${packageName}'`) {
        console.log('Driver is not installed');
        if (allowInstallAndRetry) {
          console.log('Attempting to install the driver and try again');
          
          await this.install(packageName);
          console.log('Get driver again');

          // eslint-disable-next-line no-return-await
          return await this.getInstance(serviceConfig, false);
        } else {
          console.log('Failed to get drivers');
        }
      }
    }
  }

  public async install(packageName: string) {
    try {
      const DriverClass = (await import(packageName)).default;
      console.log('Dependency already installed');
      return DriverClass;
    } catch (e) {
      if (e.message === `Cannot find module '${packageName}'`) {
        console.log('Installing missing dependency');
        await PackageManager.install(packageName);
        console.log('Finished installing missing dep');
      }
    }
  }
}
