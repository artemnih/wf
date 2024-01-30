import express from 'express';
import SlurmController from './controllers/slurm.controller';
import HealthController from './controllers/health.controller';

export const SlurmRoutes = express
	.Router()
	.post('/', SlurmController.create)
	.get('/:id/status', SlurmController.getWorkflowStatus)
	.get('/:id/logs', SlurmController.getWorkflowLogs)
	.get('/:id/outputs', SlurmController.getWorkflowOutputs)
	.get('/:id/jobs', SlurmController.getWorkflowJobs)
	.put('/:id/stop', SlurmController.stopWorkflow);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
