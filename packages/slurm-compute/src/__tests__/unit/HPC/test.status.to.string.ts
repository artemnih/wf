import {Status, convertStatusToString} from '../../../hpc';
import {expect} from '@loopback/testlab';

describe('StatusToString', () => {
  it('StatusToString ERROR', () => {
    expect(convertStatusToString(Status.ERROR)).to.be.eql('ERROR');
  });
  it('StatusToString COMPLETED', () => {
    expect(convertStatusToString(Status.COMPLETED)).to.be.eql('COMPLETED');
  });
  it('StatusToString PENDING', () => {
    expect(convertStatusToString(Status.PENDING)).to.be.eql('PENDING');
  });
  it('StatusToString NOTFOUND', () => {
    expect(convertStatusToString(100)).to.be.eql('NOTFOUND');
  });
  it('StatusToString RUNNING', () => {
    expect(convertStatusToString(Status.RUNNING)).to.be.eql('RUNNING');
  });
  it('StatusToString CANCELLED', () => {
    expect(convertStatusToString(Status.CANCELLED)).to.be.eql('CANCELLED');
  });
});
