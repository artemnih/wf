import { Dictionary } from '../shared/dictionary';
import { Class } from '@loopback/repository';
import { Driver } from '../shared/driver';
import { inject } from '@loopback/core';
import { ComputeApiBindings } from '../keys';
import { DriverManifest } from '../shared/driver-manifest';

export class DriverFactory {
  private driverClasses: Dictionary<Class<Driver>> = {};
  private manifests: Dictionary<DriverManifest> = {};

  constructor(driverClasses: Dictionary<Class<Driver>>, manifests: Dictionary<DriverManifest>) {
    for (const [key, value] of Object.entries(driverClasses)) {
      this.add(key, value);
    }
    this.manifests = manifests;
  }

  greet(@inject(ComputeApiBindings.CONFIG) config: object) {
    console.log(config);
  }

  getInstance(name: string) {
    if (!this.manifests[name]) throw new Error(`Manifest with name ${name} was not found`);

    const manifest = this.manifests[name];
    const driverType = manifest.type;
    const config = manifest.config;

    if (!this.driverClasses[driverType]) throw new Error(`Driver with name ${driverType} was not found`);

    return new this.driverClasses[driverType](config);
  }

  add(name: string, driverType: Class<Driver>) {
    this.driverClasses[name] = driverType;
  }
}
