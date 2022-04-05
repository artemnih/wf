/* eslint-disable @typescript-eslint/no-misused-promises */
import { expect } from '@loopback/testlab';
import { throws } from 'should';
import { computeCommon, driverCommon, driverUrl, healthCommon } from '../../../drivers';
import { default as axios } from 'axios';
import sinon from 'sinon';

describe('DriverUrl', () => {
  it('driverUrl argo', () => {
    expect(driverUrl('argo')).to.be.eql('http://127.0.0.1:7999');
  });
  it('driverUrl slurm', () => {
    expect(driverUrl('slurm')).to.be.eql('http://127.0.0.1:7998');
  });
  it('driverUrl cwl', () => {
    expect(driverUrl('cwl')).to.be.eql('http://127.0.0.1:7998');
  });
  it('driverUrl nodriver', () => {
    throws(() => driverUrl('nodriver'), 'Unsupported Driver');
  });
});
describe('HealthCommon', () => {
  beforeEach(() => sinon.createSandbox());
  afterEach(() => sinon.restore());
  it('argo', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'Dummy argo health' }] }));
    sinon.stub(axios, 'get').returns(resolved);
    const object = await healthCommon('argo');
    expect(object).to.be.eql([{ message: 'Dummy argo health' }]);
  });
  it('slurm', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'Dummy slurm health' }] }));
    sinon.stub(axios, 'get').returns(resolved);
    const object = await healthCommon('slurm');
    expect(object).to.be.eql([{ message: 'Dummy slurm health' }]);
  });
  it('cwl', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'Dummy slurm health' }] }));
    sinon.stub(axios, 'get').returns(resolved);
    const object = await healthCommon('slurm');
    expect(object).to.be.eql([{ message: 'Dummy slurm health' }]);
  });
  it('no driver', async () => {
    try {
      await healthCommon('noDriver');
    } catch (error) {
      expect(error.message).to.be.eql('Unsupported Driver');
    }
  });
});
describe('DriverCommon', () => {
  beforeEach(() => sinon.createSandbox());
  afterEach(() => sinon.restore());
  it('argo get', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock get' }] }));
    sinon.stub(axios, 'get').returns(resolved);
    const object = await driverCommon('fake', 'argo', 'mock', 'GET');
    expect(object).to.be.eql([{ message: 'mock get' }]);
  });
  it('argo get lowercase', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock get' }] }));
    sinon.stub(axios, 'get').returns(resolved);
    const object = await driverCommon('fake', 'argo', 'mock', 'get');
    expect(object).to.be.eql([{ message: 'mock get' }]);
  });

  it('slurm get', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock get' }] }));
    sinon.stub(axios, 'get').returns(resolved);
    const object = await driverCommon('fake', 'slurm', 'mock', 'GET');
    expect(object).to.be.eql([{ message: 'mock get' }]);
  });
  it('cwl get', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock get' }] }));
    sinon.stub(axios, 'get').returns(resolved);
    const object = await driverCommon('fake', 'cwl', 'mock', 'GET');
    expect(object).to.be.eql([{ message: 'mock get' }]);
  });
  it('no driver', async () => {
    try {
      await driverCommon('fake', 'noDriver', 'mock', 'GET');
    } catch (error) {
      expect(error.message).to.be.eql('Unsupported Driver');
    }
  });
  it('argo put', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock put' }] }));
    sinon.stub(axios, 'put').returns(resolved);
    const object = await driverCommon('fake', 'argo', 'mock', 'PUT');
    expect(object).to.be.eql([{ message: 'mock put' }]);
  });
  it('argo put lowercase', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock put' }] }));
    sinon.stub(axios, 'put').returns(resolved);
    const object = await driverCommon('fake', 'argo', 'mock', 'put');
    expect(object).to.be.eql([{ message: 'mock put' }]);
  });

  it('slurm put', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock put' }] }));
    sinon.stub(axios, 'put').returns(resolved);
    const object = await driverCommon('fake', 'slurm', 'mock', 'PUT');
    expect(object).to.be.eql([{ message: 'mock put' }]);
  });
  it('cwl put', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'mock put' }] }));
    sinon.stub(axios, 'put').returns(resolved);
    const object = await driverCommon('fake', 'cwl', 'mock', 'PUT');
    expect(object).to.be.eql([{ message: 'mock put' }]);
  });
  it('no driver put', async () => {
    try {
      await driverCommon('fake', 'noDriver', 'mock', 'PUT');
    } catch (error) {
      expect(error.message).to.be.eql('Unsupported Driver');
    }
  });
});
describe('ComputeCommon', () => {
  beforeEach(() => sinon.createSandbox());
  afterEach(() => sinon.restore());
  it('argo', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'Dummy' }] }));
    sinon.stub(axios, 'post').returns(resolved);
    const object = await computeCommon({}, {}, [], 'argo');
    expect(object).to.be.eql({ data: [{ message: 'Dummy' }]});
  });
  it('slurm', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'Dummy' }] }));
    sinon.stub(axios, 'post').returns(resolved);
    const object = await computeCommon({}, {}, [], 'slurm');
    expect(object).to.be.eql({ data: [{ message: 'Dummy' }]});
  });
  it('cwl', async () => {
    const resolved = new Promise((r) => r({ data: [{ message: 'Dummy' }] }));
    sinon.stub(axios, 'post').returns(resolved);
    const object = await computeCommon({}, {}, [], 'cwl');
    expect(object).to.be.eql({ data: [{ message: 'Dummy' }]});
  });
  it('no driver', async () => {
    try {
      await computeCommon({}, {}, [], 'nodriver');
    } catch (error) {
      expect(error.message).to.be.eql('Unsupported Driver');
    }
  });
});
