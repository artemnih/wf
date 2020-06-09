import { BaseDriver } from '../shared/driver';
import { Config } from '../shared/driver-config';

export interface DriverTwoConfig extends Config {
  demoValue: string;
}

export class DriverTwo extends BaseDriver {
  private config: DriverTwoConfig;

  constructor(config: DriverTwoConfig) {
    super(config);
    this.config = config;
  }

  getType(): string {
    return this.config.demoValue;
  }
}
