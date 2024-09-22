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
    baseDir: process.env.BASE_DIR || '/',
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
      pvcName: process.env.VOLUME_PVC_NAME,
      name: process.env.INTERNAL_ARGO_VOLUME_NAME ||  'argo-internal-volume-name',
      mountPath: process.env.VOLUME_MOUNT_PATH || '/inputs',
      outputPath: process.env.VOLUME_OUTPUT_PATH || '/outputs',
      subPath: process.env.VOLUME_SUB_PATH || 'workflows'
    }
  }
};
