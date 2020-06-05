import { Dictionary } from '../shared/types/dictionary';
import { Class } from '@loopback/repository';
import { BaseDriver } from '../shared/driver';

export interface DriverPayload {
  driverClass: Class<BaseDriver>;
  config: object;
}

export class DriverFactory {
  private driverClasses: Dictionary<DriverPayload> = {};

  getInstance(name: string) {
    const { driverClass, config } = this.driverClasses[name];
    return new driverClass({ config: config });
  }

  add(name: string, driverClass: Class<BaseDriver>, config: object) {
    this.driverClasses[name] = { driverClass, config };
  }
}
