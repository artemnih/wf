import { logger } from './services';
import { ArgoDriverConfig } from './types';
require('dotenv').config();

if (!process.env.NO_AUTH && !process.env.SERVICES_AUTH_URL) {
	logger.error('SERVICES_AUTH_URL is not set');
	throw new Error('SERVICES_AUTH_URL is not set');
}

if (!process.env.ARGO) {
	logger.error('ARGO is not set');
	throw new Error('ARGO is not set');
}

if (!process.env.VOLUME_PVC_NAME) {
	logger.error('VOLUME_PVC_NAME is not set');
	throw new Error('VOLUME_PVC_NAME is not set');
}

export const CONFIG: ArgoDriverConfig = {
	rest: {
		port: +(process.env.ARGO_DRIVER_SERVICE_PORT || 7999),
		host: process.env.ARGO_DRIVER_SERVICE_HOST || '0.0.0.0',
		noAuth: !!process.env.NO_AUTH || false,
	},
	services: {
		auth: {
			authUrl: process.env.SERVICES_AUTH_URL || '',
		},
	},
	argoCompute: {
		baseDir: process.env.BASE_DIR || '/',
		argo: {
			argoUrl: process.env.ARGO,
			tokenPath: process.env.ARGO_TOKEN_PATH || '',
			namespace: process.env.ARGO_NAMESPACE || 'default',
		},
		volumeDefinitions: {
			pvcName: process.env.VOLUME_PVC_NAME,
			name: process.env.INTERNAL_ARGO_VOLUME_NAME || 'argo-internal-volume-name',
			mountPath: process.env.VOLUME_MOUNT_PATH || '/inputs',
			outputPath: process.env.VOLUME_OUTPUT_PATH || '/outputs',
			subPath: process.env.VOLUME_SUB_PATH || 'workflows',
		},
	},
};
