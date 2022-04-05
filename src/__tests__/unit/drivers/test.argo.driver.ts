import { expect } from '@loopback/testlab';
import { ArgoDriver } from '../../../drivers';
import { DriverFactory } from '../../../drivers/driver-base';

describe('DriverFactory', () => {
  it('Build Argo Driver', () => {
    const argo = DriverFactory.createDriver('Argo');
    expect(argo).to.instanceof(ArgoDriver);
  });
});
