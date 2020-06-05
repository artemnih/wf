import { BaseDriver } from '../shared/driver';

export class DriverOne extends BaseDriver {
  private type = 'default driver one';

  constructor(n: string) {
    super(n);
    this.type = n;
  }

  getType(): string {
    return this.type;
  }
}
