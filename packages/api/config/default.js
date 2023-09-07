module.exports = {
  rest: {
    port: +(process.env.PORT || 8000),
    host: process.env.HOST || '0.0.0.0',
    openApiSpec: {
      setServersFromRequest: false,
      servers: [{url: '/'}],
    },
    listenOnStart: false,
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
    },
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL,
      tenant: process.env.SERVICES_AUTH_TENANT
    },
    log: {
      enableMetadata: true,
    },
    notifications: {
      email: {
        type: process.env.SERVICES_NOTIFICATIONS_EMAIL_TYPE || 'smtp',
        settings: {
          defaultFromEmail: process.env.SERVICES_NOTIFICATIONS_EMAIL_USER,
          service: process.env.SERVICES_NOTIFICATIONS_EMAIL_SERVICE || 'gmail',
          auth: {
            user: process.env.SERVICES_NOTIFICATIONS_EMAIL_USER,
            pass: process.env.SERVICES_NOTIFICATIONS_EMAIL_PASSWORD,
          },
        },
      },
    },
    cache: {
      type: process.env.SERVICES_NOTIFICATIONS_CACHE_TYPE || 'memory',
      memory: {
        isGlobalCache: true,
      },
    },
  },
  compute: {
    basePath: '/',
    test: 'TEST',
    email: {
      to: process.env.TEMPLATE_EMAIL_TO,
    },
    drivers: {
      argoDriver: {
        scheme: process.env.ARGO_DRIVER_SCHEME || 'http',
        host: process.env.ARGO_DRIVER_URL || '127.0.0.1',
        port: process.env.ARGO_DRIVER_PORT || '7999',  
      },
      slurmDriver: {
        scheme: process.env.SLURM_DRIVER_SCHEME || 'http',
        host: process.env.SLURM_DRIVER_URL || '127.0.0.1',
        port: process.env.SLURM_DRIVER_PORT || '7998',
      },
    },
    computeName: process.env.COMPUTE_SERVICE_NAME || '127.0.0.1',
    db: {
      connectionString: process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017',
      name: 'WorkflowDb'
    },
  },
};
