import { ExpressServer } from '../src/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import ConfigService from '../src/services/config.service';
import testWorkflow from './data/echo-workflow.json';

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
			testDriver: {
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
	}),
	http.post('http://localhost:7997/compute', () => {
		return HttpResponse.text('123ok');
	}),
	http.get('http://localhost:7997/compute/123ok/status', () => {
		return HttpResponse.json({ status: 'running' });
	}),
	http.get('http://localhost:7997/compute/123ok/logs', () => {
		return HttpResponse.json({ logs: 'running' });
	}),
	http.get('http://localhost:7997/compute/123ok/all-jobs-logs', () => {
		return HttpResponse.json({ logs: 'running' });
	}),
);

describe('ExpressServer', () => {
	let mongod: MongoMemoryServer;
	let server: ExpressServer;

	beforeAll(async () => {
		console.log('Starting MongoMemoryServer');
		mongod = await MongoMemoryServer.create();
		console.log('MongoMemoryServer started');
		const uri = mongod.getUri();
		config.compute.db.connectionString = uri;
		ConfigService.setConfig(config);
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
			console.log(`Starting TEST server at port ${config.rest.port}`);
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

	describe('With mocked Driver', () => {
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
				const response = await request(server.app).get('/health/check/non-existing-driver');
				expect(response.status).toBe(500);
			});

			it('should return 200 when existing driver is called', async () => {
				const response = await request(server.app).get('/health/check/test');
				expect(response.status).toBe(200);
			});
		});

		describe('Workflow life-cycle', () => {
			let wfid: string;

			it('submits workflow', async () => {
				const response = await request(server.app).post('/compute/workflows').send(testWorkflow);
				expect(response.status).toBe(201);
			});

			it('gets all workflows', async () => {
				const workflowsResponse = await request(server.app).get('/compute/workflows');
				const workflows = workflowsResponse.body;
				expect(workflows.length).toBe(1);
				wfid = workflows[0].id;
			});

			it('gets one workflow by id', async () => {
				const singleWfResp = await request(server.app).get(`/compute/workflows/${wfid}`);
				const singleWf = singleWfResp.body;
				expect(singleWf.id).toBe(wfid);
			});

			it('updates workflow', async () => {
				const singleWfResp = await request(server.app).get(`/compute/workflows/${wfid}`);
				const singleWf = singleWfResp.body;
				singleWf.name = 'new name';
				const updatedWfResp = await request(server.app).patch(`/compute/workflows/${wfid}`).send(singleWf);
				const updatedWf = updatedWfResp.body;
				expect(updatedWf.name).toBe('new name');
			});

			it('gets workflow status', async () => {
				const statusResp = await request(server.app).get(`/compute/workflows/${wfid}/status`);
				const status = statusResp.body;
				expect(status.status).toBe('running');
			});

			it('gets workflow logs', async () => {
				const logsResp = await request(server.app).get(`/compute/workflows/${wfid}/logs`);
				const logs = logsResp.body;
				expect(logs.logs).toBe('running');
			});

			it('gets all jobs logs', async () => {
				const allLogsResp = await request(server.app).get(`/compute/workflows/${wfid}/all-jobs-logs`);
				const allLogs = allLogsResp.body;
				expect(allLogs.logs).toBe('running');
			});
		});
	});
});
