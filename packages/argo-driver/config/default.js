// prettier-ignore
module.exports = {
  rest: {
    port: +(process.env.ARGO_DRIVER_SERVICE_PORT || 7999),
    host: process.env.ARGO_DRIVER_SERVICE_HOST || '0.0.0.0',
    openApiSpec: {
      setServersFromRequest: true,
    },
    listenOnStart: false,
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL,
      tenant: process.env.SERVICES_AUTH_TENANT 
    },
    log: {
      enableMetadata: true
    },
    notifications: {
      email: {
        type:process.env.SERVICES_NOTIFICATIONS_EMAIL_TYPE || 'smtp',
        settings: {
          defaultFromEmail: process.env.SERVICES_NOTIFICATIONS_EMAIL_USER,
          service: process.env.SERVICES_NOTIFICATIONS_EMAIL_SERVICE || 'gmail',
          auth: {
            user: process.env.SERVICES_NOTIFICATIONS_EMAIL_USER,
            pass: process.env.SERVICES_NOTIFICATIONS_EMAIL_PASSWORD,
          },
        },
      }
    },
    cache: {
      type: process.env.SERVICES_NOTIFICATIONS_CACHE_TYPE || 'memory',
      memory:{
        isGlobalCache:true
      }
  
    },
  },
  argoCompute: {
    basePath:'/',
    test: 'TEST',
    email:{
      to: process.env.TEMPLATE_EMAIL_TO
    },
    compute: process.env.COMPUTE_API_HOST || 'http://127.0.0.1:8000/compute',
    db:{
      name: "ApiDS",
      connector: "memory",
      localStorage: "",
      file: ""
    },
    argo: {
      argoUrl: process.env.ARGO
    },
    volumeDefinitions: {
      name: 'wipp-data-volume',
      mountPath: '/data/inputs',
      outputPath: '/data/outputs',
      subPath: 'temp/jobs',
      absoluteOutputPath: '/data/inputs/temp/jobs'
    }
  }
};
