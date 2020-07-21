import { PackageManager } from '../utils/package-manager'; // uncomment if using dynamic npm install
import { ServiceConfig } from '../models/service-config.model';
import { Driver } from '../types/driver';

export class DriverFactory {
  public async getInstance(serviceConfig: ServiceConfig) {
    // const DriverClass = (await import('../drivers/microservice-driver')).default;
    const DriverClass = (await import(serviceConfig.package)).default;
    return new DriverClass(serviceConfig.config) as Driver;
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
