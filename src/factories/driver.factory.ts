import { Dictionary } from '../shared/dictionary';
import { Class } from '@loopback/repository';
import { Driver } from '../shared/driver';
import { Config } from '../shared/driver-config';

export class DriverFactory {
  private driverClasses: Dictionary<Class<Driver>> = {};

  constructor(driverClasses: Dictionary<Class<Driver>> = {}) {
    for (const [key, value] of Object.entries(driverClasses)) {
      this.add(key, value);
    }
  }

  getInstance(name: string, config: Config) {
    if (!this.driverClasses[name]) throw new Error(`Driver with name ${name} was not found`);
    return new this.driverClasses[name](config);
  }

  add(name: string, driverType: Class<Driver>) {
    this.driverClasses[name] = driverType;
  }
}
