import * as http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import { WorkflowRoutes, HealthRoutes, JobRoutes, ExplorerRoutes } from './router';
import cors from 'cors';
import jwksRsa from 'jwks-rsa';
import { expressjwt } from 'express-jwt';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerSchema from './swagger.json';
import ConfigService from './services/config.service';
import DriverRepository from './repositories/driver.repository';
import { handleHttpError } from './handlers/axios-error';

export class ExpressServer {
	app: express.Application;
	server: http.Server;
	options: any;

	constructor() {
		this.options = ConfigService.getConfig();
		const dbName = this.options.compute.db.name;
		const connectionString = this.options.compute.db.connectionString;
		const authUrl = this.options.rest.noAuth ? '' : this.options.services.auth.authUrl;
		const noAuth = this.options.rest.noAuth;
		mongoose.connect(connectionString, {
			dbName: dbName,
		});

		console.log('Config:', this.options);
		this.app = express();
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		if (noAuth === undefined || noAuth === false || noAuth === 'false') {
			console.log('Compute API: Enabling JWT authentication');
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
			console.log('Compute API: NO_AUTH=true detected: Disabling JWT authentication');
		}

		this.app.use('/compute', WorkflowRoutes);
		this.app.use('/compute', JobRoutes);
		this.app.use('/compute', ExplorerRoutes);
		this.app.use('/health', HealthRoutes);
		this.app.use(handleHttpError);

		// Serve static files in the public folder
		this.app.use(express.static('public'));

		const specs = swaggerJsdoc(swaggerSchema);
		this.app.use('/explorer/', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			if (err) {
				console.error(err.message);
				const status = err.status || 500;
				const message = err.message || 'Something went wrong';
				res.status(status).send(message);
			}
			next(err);
		});
	}

	public async start() {
		this.server = this.app.listen(this.options.rest.port, this.options.rest.host);
		await DriverRepository.loadDrivers();
	}

	public stop() {
		if (!this.server) return;
		this.server.close();
	}
}
