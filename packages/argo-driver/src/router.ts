import express from 'express';
import Controller from './controllers/argo.controller';
import HealthController from './controllers/health.controller';

export const ComputeRoutes = express
	.Router()
	.post('/', Controller.createWorkflow)
	.get('/:id/status', Controller.getWorkflowStatus)
	.get('/:id/logs', Controller.getWorkflowLogs)
	.get('/:id/all-jobs-logs', Controller.getAllJobsLogs)
	.get('/:id/job/:jobname/logs', Controller.getJobLogs)
	.get('/:id/job/:jobname/status', Controller.getJobStatus)
	.get('/:id/outputs', Controller.getWorkflowOutputs)
	.get('/:id/jobs', Controller.getWorkflowJobs)
	.put('/:id/stop', Controller.stopWorkflow);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
