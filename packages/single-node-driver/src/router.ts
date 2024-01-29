import express from 'express';
import WorkflowController from './controllers/workflow.controller';
import HealthController from './controllers/health.controller';

export const WorkflowRoutes = express
	.Router()
	.post('/singlenode', WorkflowController.createWorkflow)
	.get('/singlenode/:id/status', WorkflowController.getWorkflowStatus)
	.get('/singlenode/:id/logs', WorkflowController.getWorkflowLogs)
	.get('/singlenode/:id/outputs', WorkflowController.getWorkflowOutputs)
	.get('/singlenode/:id/jobs', WorkflowController.getWorkflowJobs)
	.put('/singlenode/:id/stop', WorkflowController.stop);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
