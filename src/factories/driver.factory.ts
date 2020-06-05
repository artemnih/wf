import { Dictionary } from '../shared/types/dictionary';
import { Class } from '@loopback/repository';
import { Driver } from '../shared/driver';

export class DriverFactory {
    private driverClasses: Dictionary<Class<Driver>> = {};

    constructor(driverClasses: Dictionary<Class<Driver>> = {}) {
        for (let [key, value] of Object.entries(driverClasses)) {
            this.add(key, value);
        }
    }

    getInstance(name: string) {
        return new this.driverClasses[name]();
    }

    add(name: string, driverType: Class<Driver>) {
        this.driverClasses[name] = driverType;
    }
}