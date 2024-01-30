import express from 'express';
import WorkflowController from './controllers/workflow.controller';
import HealthController from './controllers/health.controller';

export const WorkflowRoutes = express
	.Router()
	.post('/', WorkflowController.createWorkflow)
	.get('/:id/status', WorkflowController.getWorkflowStatus)
	.get('/:id/logs', WorkflowController.getWorkflowLogs)
	.get('/:id/outputs', WorkflowController.getWorkflowOutputs)
	.get('/:id/jobs', WorkflowController.getWorkflowJobs)
	.put('/:id/stop', WorkflowController.stop);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
