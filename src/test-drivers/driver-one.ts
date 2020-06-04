import { Driver } from '../shared/driver';

export class DriverOne implements Driver {
    private type = "This is Driver One";

    getType(): string {
        return this.type;
    }

}