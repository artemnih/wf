// prettier-ignore
module.exports = {
  rest: {
    port: +(process.env.ARGO_DRIVER_SERVICE_PORT || 7999),
    host: process.env.ARGO_DRIVER_SERVICE_HOST || '0.0.0.0',
    noAuth: process.env.NO_AUTH || false,
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL,
    },
  },
  argoCompute: {
    basePath:'/',
    test: 'TEST',
    email:{
      to: process.env.TEMPLATE_EMAIL_TO
    },
    db:{
      name: "ApiDS",
      connector: "memory",
      localStorage: "",
      file: ""
    },
    argo: {
      argoUrl: process.env.ARGO,
      tokenPath: process.env.ARGO_TOKEN_PATH || '',
      namespace: process.env.ARGO_NAMESPACE || 'default',
    },
    volumeDefinitions: {
      pvcName: process.env.VOLUME_PVC_NAME || 'compute-pv-claim',
      name: 'compute-data-volume',
      mountPath: process.env.VOLUME_MOUNT_PATH,
      outputPath: process.env.VOLUME_OUTPUT_PATH,
      subPath: process.env.VOLUME_SUB_PATH,
      absoluteOutputPath: process.env.VOLUME_ABSOLUTE_OUTPUT_PATH,
    }
  }
};
