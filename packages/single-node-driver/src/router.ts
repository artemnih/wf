import express from 'express';
import WorkflowController from './controllers/workflow.controller';
import HealthController from './controllers/health.controller';

export const WorkflowRoutes = express
	.Router()
	.post('/singlenode', WorkflowController.submit)
	.get('/singlenode/:id/status', WorkflowController.status)
	.get('/singlenode/:id/logs', WorkflowController.logs)
	.get('/singlenode/:id/outputs', WorkflowController.logs)
	.get('/singlenode/:id/jobs', WorkflowController.status)
	.put('/singlenode/:id/stop', WorkflowController.stop);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
