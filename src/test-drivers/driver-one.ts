import { BaseDriver } from '../shared/driver';
import { exec, ExecException } from 'child_process';
import { Config } from '../shared/driver-config';

export interface DriverOneConfig extends Config {
  demoValue: string;
}

export class DriverOne extends BaseDriver {
  private config: DriverOneConfig;

  constructor(config: DriverOneConfig) {
    super(config);
    this.config = config;
  }

  getType(): string {
    exec('echo "DriverOne Termnial Output"', (error: ExecException | null, stdout: string, stderr: string) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    });

    return this.config.demoValue;
  }
}
