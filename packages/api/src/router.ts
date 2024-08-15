import express from 'express';
import WorkflowController from './controllers/workflow.controller';
import JobController from './controllers/job.controller';
import HealthController from './controllers/health.controller';
import ExplorerController from './controllers/explorer.controller';
import LoggerController from './controllers/logger.controller';

export const WorkflowRoutes = express
	.Router()
	.post('/workflows', WorkflowController.create)
	.get('/workflows', WorkflowController.find)
	.get('/workflows/:id', WorkflowController.findById)
	.patch('/workflows/:id', WorkflowController.updateById)
	.post('/workflows/:id/resubmit', WorkflowController.resubmitWorkflow)
	.get('/workflows/:id/status', WorkflowController.getWorkflowStatus)
	.get('/workflows/:id/logs', WorkflowController.getWorkflowLogs)
	.get('/workflows/:id/all-jobs-logs', WorkflowController.getAllJobsLogs)
	.get('/workflows/:id/job/:jobId/logs', WorkflowController.getWorkflowJobLogs)
	.get('/workflows/:id/job/:jobId/status', WorkflowController.getWorkflowJobStatus)
	.get('/workflows/:id/output/*', WorkflowController.getWorkflowOutput)
	.get('/workflows/:id/jobs', WorkflowController.getWorkflowJobs)
	.put('/workflows/:id/stop', WorkflowController.stopWorkflow)
	.put('/workflows/:id/restart', WorkflowController.restartWorkflow)
	.put('/workflows/:id/pause', WorkflowController.pauseWorkflow)
	.get('/drivers', WorkflowController.getDrivers)
	.get('/drivers/:driver/logs', WorkflowController.getDriverLogs);

export const JobRoutes = express.Router().get('/jobs', JobController.find).get('/jobs/:jobId', JobController.findById);

export const HealthRoutes = express.Router().get('/check/:driver', WorkflowController.checkHealth).get('/check', HealthController.ping);

export const ExplorerRoutes = express.Router().get('/files/content/:driver/*', ExplorerController.getContent);

export const LoggerRoutes = express.Router().get('/logs', LoggerController.getServerLogs);
