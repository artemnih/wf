import { BaseDriver } from '../shared/driver';
import { exec } from 'child_process';
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
        var yourscript = exec('echo "DriverOne Termnial Output"', (error: any, stdout: string, stderr: string) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });

        return this.config.demoValue;
    }
}
