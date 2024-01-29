// prettier-ignore
module.exports = {
  rest: {
    port: +(process.env.API_PORT || 7998),
    host: process.env.API_HOST || '0.0.0.0',
    openApiSpec: {
      setServersFromRequest: true,
    },
    listenOnStart: false,
    noAuth: process.env.NO_AUTH || false,
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL,
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
  slurmCompute: {
    basePath:'/',
    test: 'TEST',
    data: process.env.SLURM_TEMP_DIR || '/tmp/cwl',
    hpcSchedule: process.env.HPC_SCHEDULER || 'slurm',
    email:{
      to: process.env.TEMPLATE_EMAIL_TO
    },
    db:{
      name: "ApiDS",
      connector: "memory",
      localStorage: "",
      file: ""
    }
  }
};
