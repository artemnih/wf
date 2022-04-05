import { expect } from '@loopback/testlab';
import { throws } from 'should';
import { ArgoDriver, SlurmDriver } from '../../../drivers';
import { DriverFactory } from '../../../drivers/driver-base';

describe('DriverFactory', () => {
  it('Build Argo Driver', () => {
    const argo = DriverFactory.createDriver('Argo');
    expect(argo).to.instanceof(ArgoDriver);
  });
  it('Build Argo uppercase Driver', () => {
    const argoUpper = DriverFactory.createDriver('ARGO');
    expect(argoUpper).to.instanceof(ArgoDriver);
  });
  it('Build CWL Driver', () => {
    const cwl = DriverFactory.createDriver('Slurm');
    expect(cwl).to.instanceof(SlurmDriver);
  });
  it('Build CWL uppercase Driver', () => {
    const cwl = DriverFactory.createDriver('SLURM');
    expect(cwl).to.instanceof(SlurmDriver);
  });

  it('Non existant driver', () => {
    throws(() => DriverFactory.createDriver('I DONT EXIST'), 'Driver i dont exist not found');
  });
});
