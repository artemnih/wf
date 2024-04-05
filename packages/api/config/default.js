module.exports = {
	rest: {
		port: +(process.env.PORT || 8000),
		host: process.env.HOST || '0.0.0.0',
		cors: {
			origin: process.env.CORS_ORIGIN || '*',
		},
		noAuth: process.env.NO_AUTH || false,
	},
	services: {
		auth: {
			authUrl: process.env.SERVICES_AUTH_URL,
		},
	},
	compute: {
		basePath: '/',
		test: 'TEST',
		email: {
			to: process.env.TEMPLATE_EMAIL_TO,
		},
		drivers: {
			argo: {
				url: process.env.ARGO_DRIVER_URL || 'http://127.0.0.1:7999',
			},
			slurm: {
				url: process.env.SLURM_DRIVER_URL || 'http://127.0.0.1:7998',
			},
			singlenode: {
				url: process.env.SINGLENODE_DRIVER_URL || 'http://127.0.0.1:7997',
			},
		},
		computeName: process.env.COMPUTE_SERVICE_NAME || '127.0.0.1',
		db: {
			connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017',
			name: process.env.MONGO_DB_NAME || 'WorkflowDb',
		},
	},
};
