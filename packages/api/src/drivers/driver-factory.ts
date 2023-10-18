import { ArgoDriver } from './driver-argo';
import { Driver } from './driver';
import { SlurmDriver } from './driver-slurm';
import { SingleNodeDriver } from './driver-single-node';

export class DriverFactory {

  public static createDriver(driverType: string): Driver {
    const lowerDriver = driverType.toLowerCase();
    
    if (lowerDriver === 'argo') {
      return new ArgoDriver();
    }

    if (lowerDriver === 'slurm') {
      return new SlurmDriver();
    }

    if (lowerDriver === 'singlenode') {
      return new SingleNodeDriver();
    }

    throw Error(`Driver ${lowerDriver} not found`);
  }
}
