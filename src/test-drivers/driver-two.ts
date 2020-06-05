import { BaseDriver } from '../shared/driver';

export class DriverTwo extends BaseDriver {
  private type = 'Default Driver Two';

  constructor(n: string) {
    super(n);
    this.type = n;
  }

  getType(): string {
    return this.type;
  }
}
