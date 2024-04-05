// prettier-ignore
module.exports = {
  rest: {
    port: +(process.env.API_PORT || 7998),
    host: process.env.API_HOST || '0.0.0.0',
    noAuth: process.env.NO_AUTH || false,
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL,
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
