import { ArgoDriver } from './driver-argo';

import { Driver } from './driver';
import { SlurmDriver } from './driver-slurm';

export class DriverFactory {
  public static createDriver(driverType: string): Driver {
    const lowerDriver = driverType.toLowerCase();
    if (lowerDriver === 'argo') {
      return new ArgoDriver();
    }
    if (lowerDriver === 'slurm') {
      return new SlurmDriver();
    }
    throw Error(`Driver ${lowerDriver} not found`);
  }
}
