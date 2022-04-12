module.exports = {
  rest: {
    port: +(process.env.COMPUTE_API_PORT || 8000),
    host: process.env.COMPUTE_API_HOST || '0.0.0.0',
    openApiSpec: {
      setServersFromRequest: true,
    },
    listenOnStart: false,
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL || 'https://a-ci.labshare.org/_api',
      tenant: process.env.SERVICES_AUTH_TENANT,
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
        host: process.env.ARGO_SERVICE_NAME || '127.0.0.1',
        port: process.env.ARGO_SERVICE_PORT || '7999',  
      },
      slurmDriver: {
        host: process.env.SLURM_SERVICE_HOST || '127.0.0.1',
        port: process.env.SLURM_SERVICE_PORT || '7998',
      },
    },
    computeName: process.env.COMPUTE_SERVICE_NAME || '127.0.0.1',
    db: {
      port: process.env.MONGO_CONNECTION_PORT || 27017,
      url: process.env.MONGO_CONNECTION_NAME || 'localhost',
      name: 'mongodb',
      connector: 'mongodb',
      username: '',
      password: ''
    },
  },
};
