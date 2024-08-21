module.exports = {
	rest: {
		port: +(process.env.PORT || 8000),
		host: process.env.HOST || '0.0.0.0',
		noAuth: process.env.NO_AUTH || false,
	},
	services: {
		auth: {
			authUrl: process.env.SERVICES_AUTH_URL,
		},
	},
	compute: {
		basePath: '/',
		db: {
			connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017',
			name: process.env.MONGO_DB_NAME || 'WorkflowDb',
		},
	},
};
