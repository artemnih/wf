import { Driver } from '../shared/driver';

export class DriverTwo implements Driver {
    private type = "This is Driver Two";
    
    getType(): string {
        return this.type;
    }

}