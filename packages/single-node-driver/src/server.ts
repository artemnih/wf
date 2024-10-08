import express from 'express';
import * as http from 'http';
import cors from 'cors';
import jwksRsa from 'jwks-rsa';
import { expressjwt } from 'express-jwt';
import { WorkflowRoutes, HealthRoutes } from './router';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerSchema from './swagger.json';

export class ExpressServer {
	private app: express.Application;
	private server: http.Server;

	constructor(private options: any) {
		const authUrl = this.options.services.auth.authUrl;

		this.app = express();
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		if (!this.options.rest.noAuth) {
			console.log('Single Node Driver: Enabling JWT authentication');
			this.app.use(
				'/compute',
				expressjwt({
					secret: jwksRsa.expressJwtSecret({
						cache: true,
						rateLimit: true,
						jwksRequestsPerMinute: 5,
						jwksUri: `${authUrl}/.well-known/jwks.json`,
					}) as any,
					algorithms: ['RS256'],
					issuer: authUrl,
				}),
			);
		} else {
			console.log('Single Node Driver: NO_AUTH=true detected: Disabling JWT authentication');
		}

		this.app.use('/compute', WorkflowRoutes);
		this.app.use('/health', HealthRoutes);

		// Serve static files in the public folder
		this.app.use(express.static('public'));

		const specs = swaggerJsdoc(swaggerSchema);
		this.app.use('/explorer/', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
	}

	public async start() {
		this.server = this.app.listen(this.options.rest.port, this.options.rest.host);
	}

	public async stop() {
		if (!this.server) return;
		this.server.close();
	}
}
