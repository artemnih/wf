import { ExpressServer } from '../src/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
const request = require('supertest');
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import ConfigService from '../src/services/config.service';

const config = {
	rest: {
		port: 8001,
		noAuth: true,
	},
	compute: {
		db: {
			connectionString: '',
			name: 'test',
		},
		basePath: '/compute',
		drivers: {
			singlenodeDriver: {
				scheme: 'http',
				host: 'localhost',
				port: 7997,
			},
		},
	},
};

// URLs is hardcoded for now, but should be read from the DB. not even from the config file
const driverServer = setupServer(
	http.get('http://localhost:7997/compute/health', () => {
		return HttpResponse.json({ greeting: 'Hello, world!' });
	})
);

describe('ExpressServer', () => {
	let mongod: MongoMemoryServer;
	let server: ExpressServer;

	beforeAll(async () => {
		mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
		config.compute.db.connectionString = uri;
		ConfigService.config = config;

		driverServer.listen();
	});

	afterEach(() => {
		driverServer.resetHandlers();
	});

	afterAll(async () => {
		await mongod.stop();
		driverServer.close();
	});

	describe('Simple api', () => {
		beforeAll(async () => {
			console.log(`Starting TEST server at port ${config.rest.port}`)
			server = new ExpressServer();
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

	describe('With mocked Single Node Driver', () => {
		let server: ExpressServer;

		beforeAll(async () => {
			server = new ExpressServer();
			await server.start();
		});

		afterAll(async () => {
			await server.stop();
		});

		it('should return 200 when health url is called', async () => {
			const response = await request(server.app).get('/health/check');
			const body = response.body;
			expect(body).toHaveProperty('greeting');
			expect(response.status).toBe(200);
		});

		describe('Driver health check', () => {
			it('should return 500 when non-existing driver is called', async () => {
				const response = await request(server.app).get('/health/check/singlenode1Broken');
				expect(response.status).toBe(500);
			});

			it('should return 200 when existing driver is called', async () => {
				const response = await request(server.app).get('/health/check/singlenode');
				expect(response.status).toBe(200);
			});
		});
	});
});
