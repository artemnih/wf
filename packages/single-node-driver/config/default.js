module.exports = {
  rest: {
    port: +(process.env.SINGLE_NODE_DRIVER_SERVICE_PORT || 7997),
    host: process.env.SINGLE_NODE_DRIVER_SERVICE_HOST || '0.0.0.0',
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL
    }
  },
  singleNodeCompute: {
    basePath: '/',
  }
};
