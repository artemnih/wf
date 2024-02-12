// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { expect } from '@loopback/testlab';
// import { throws } from 'should';
// import { computeCommon, driverCommon, driverUrl, healthCommon } from '../../../drivers';
// import { default as axios } from 'axios';
// import sinon from 'sinon';

// describe('DriverUrl', () => {
// 	it('driverUrl argo', () => {
// 		expect(driverUrl('argo')).to.be.eql('http://127.0.0.1:7999');
// 	});
// 	it('driverUrl slurm', () => {
// 		require('dotenv').config();
// 		const config = require('config');
// 		const host = config.compute.drivers.slurmDriver.host;
// 		const port = config.compute.drivers.slurmDriver.port;
// 		expect(driverUrl('slurm')).to.be.eql(`http://${host}:${port}`);
// 	});
// 	it('driverUrl nodriver', () => {
// 		throws(() => driverUrl('nodriver'), 'Unsupported Driver');
// 	});
// });
// describe('HealthCommon', () => {
// 	const dummyToken = '';
// 	beforeEach(() => sinon.createSandbox());
// 	afterEach(() => sinon.restore());
// 	it('argo', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'Dummy argo health' }] }));
// 		sinon.stub(axios, 'get').returns(resolved);
// 		const object = await healthCommon('argo', dummyToken);
// 		expect(object).to.be.eql([{ message: 'Dummy argo health' }]);
// 	});
// 	it('slurm', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'Dummy slurm health' }] }));
// 		sinon.stub(axios, 'get').returns(resolved);
// 		const object = await healthCommon('slurm', dummyToken);
// 		expect(object).to.be.eql([{ message: 'Dummy slurm health' }]);
// 	});
// 	it('no driver', async () => {
// 		try {
// 			await healthCommon('noDriver', dummyToken);
// 		} catch (error) {
// 			expect(error.message).to.be.eql('Unsupported Driver');
// 		}
// 	});
// });
// describe('DriverCommon', () => {
// 	const dummyToken = '';
// 	beforeEach(() => sinon.createSandbox());
// 	afterEach(() => sinon.restore());
// 	it('argo get', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'mock get' }] }));
// 		sinon.stub(axios, 'request').returns(resolved);
// 		const object = await driverCommon('fake', 'argo', 'mock', dummyToken, 'GET');
// 		expect(object).to.be.eql([{ message: 'mock get' }]);
// 	});
// 	it('argo get lowercase', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'mock get' }] }));
// 		sinon.stub(axios, 'request').returns(resolved);
// 		const object = await driverCommon('fake', 'argo', 'mock', dummyToken, 'get');
// 		expect(object).to.be.eql([{ message: 'mock get' }]);
// 	});

// 	it('slurm get', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'mock get' }] }));
// 		sinon.stub(axios, 'request').returns(resolved);
// 		const object = await driverCommon('fake', 'slurm', 'mock', dummyToken, 'GET');
// 		expect(object).to.be.eql([{ message: 'mock get' }]);
// 	});
// 	it('no driver', async () => {
// 		try {
// 			await driverCommon('fake', 'noDriver', 'mock', dummyToken, 'GET');
// 		} catch (error) {
// 			expect(error.message).to.be.eql('Unsupported Driver');
// 		}
// 	});
// 	it('argo put', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'mock put' }] }));
// 		sinon.stub(axios, 'request').returns(resolved);
// 		const object = await driverCommon('fake', 'argo', 'mock', dummyToken, 'PUT');
// 		expect(object).to.be.eql([{ message: 'mock put' }]);
// 	});
// 	it('argo put lowercase', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'mock put' }] }));
// 		sinon.stub(axios, 'request').returns(resolved);
// 		const object = await driverCommon('fake', 'argo', 'mock', dummyToken, 'put');
// 		expect(object).to.be.eql([{ message: 'mock put' }]);
// 	});

// 	it('slurm put', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'mock put' }] }));
// 		sinon.stub(axios, 'request').returns(resolved);
// 		const object = await driverCommon('fake', 'slurm', 'mock', dummyToken, 'PUT');
// 		expect(object).to.be.eql([{ message: 'mock put' }]);
// 	});
// 	it('no driver put', async () => {
// 		try {
// 			await driverCommon('fake', 'noDriver', 'mock', dummyToken, 'PUT');
// 		} catch (error) {
// 			expect(error.message).to.be.eql('Unsupported Driver');
// 		}
// 	});
// });
// describe('ComputeCommon', () => {
// 	const dummyToken = '';
// 	beforeEach(() => sinon.createSandbox());
// 	afterEach(() => sinon.restore());
// 	it('argo', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'Dummy' }] }));
// 		sinon.stub(axios, 'post').returns(resolved);
// 		const object = await computeCommon({}, {}, [], 'argo', dummyToken);
// 		expect(object).to.be.eql({ data: [{ message: 'Dummy' }] });
// 	});
// 	it('slurm', async () => {
// 		const resolved = new Promise(r => r({ data: [{ message: 'Dummy' }] }));
// 		sinon.stub(axios, 'post').returns(resolved);
// 		const object = await computeCommon({}, {}, [], 'slurm', dummyToken);
// 		expect(object).to.be.eql({ data: [{ message: 'Dummy' }] });
// 	});
// 	it('no driver', async () => {
// 		try {
// 			await computeCommon({}, {}, [], 'nodriver', dummyToken);
// 		} catch (error) {
// 			expect(error.message).to.be.eql('Unsupported Driver');
// 		}
// 	});
// });
