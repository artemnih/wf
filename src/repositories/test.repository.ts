import { inject } from '@loopback/core';
import { DriverBindings } from '../keys';
import { Driver } from '../shared/driver';

export class TestRepository {
  private driver: Driver;
  constructor(@inject(DriverBindings.Driver) driver: Driver) {
    this.driver = driver;
  }

  public getType() {
    return this.driver.getType();
  }
}
