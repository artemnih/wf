import express from 'express';
import * as http from 'http';
import cors from 'cors';
import jwksRsa from 'jwks-rsa';
import { expressjwt } from 'express-jwt';
import { SlurmRoutes, HealthRoutes } from './router';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerSchema from './swagger.json';
import path from 'path';

// path for toil output to create an asset directory
export const toilOutputDir = path.join(__dirname, 'out');

// path for toil logs to create an asset directory
export const toilLogsDir = path.join(__dirname, 'logs');

export class ExpressServer {
	private app: express.Application;
	private server: http.Server;

	constructor(private options: any) {
		const authUrl = this.options.services.auth.authUrl;

		this.app = express();
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		if (false) {
			console.log('Slurm Driver: Enabling JWT authentication');
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
			console.log('Slurm Driver: NO_AUTH=true detected: Disabling JWT authentication');
		}

		// Expose the front-end assets via Express, not as LB4 route
		// this.app.use(this.options.slurmCompute.basePath, this.api.requestHandler);

		this.app.use('/compute', SlurmRoutes);
		this.app.use('/health', HealthRoutes);

		// Serve static files in the public folder
		this.app.use(express.static('public'));

		// Serve toil output files back to user
		this.app.use(express.static(toilOutputDir));
		// Serve toil logs files back to user
		this.app.use(express.static(toilLogsDir));

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
