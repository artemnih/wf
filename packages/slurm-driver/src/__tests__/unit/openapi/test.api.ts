import { SlurmComputeApplication } from '../../..';
import { RestServer } from '@loopback/rest';
import { validateApiSpec } from '@loopback/testlab';

describe('API specification', () => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	it('api spec is valid', async () => {
		const app = new SlurmComputeApplication();
		const server = await app.getServer(RestServer);
		const spec = await server.getApiSpec();
		await validateApiSpec(spec);
	});
});
