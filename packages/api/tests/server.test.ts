import { ExpressServer } from '../src/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
const request = require('supertest');

require('dotenv').config();
const config = require('config');

describe('ExpressServer api', () => {
	let mongod: MongoMemoryServer;
	let server: ExpressServer;

	beforeAll(async () => {
		mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
		config.compute.db.connectionString = uri;
		config.rest.noAuth = true;
		server = new ExpressServer(config);
		await server.start();
	});

	afterAll(async () => {
		await server.stop();
	});

	it('should return 404 when non-existing url is called', async () => {
		const response = await request(server.app).get('/random-url');
		expect(response.status).toBe(404);
	});

	it('should return 200 when health url is called', async () => {
		const response = await request(server.app).get('/health/check');
		const body = response.body;
		expect(body).toHaveProperty('greeting');
		expect(response.status).toBe(200);
	});
});
