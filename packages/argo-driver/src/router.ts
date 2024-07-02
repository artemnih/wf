import express from 'express';
import Controller from './controllers/argo.controller';
import HealthController from './controllers/health.controller';
import { DriverRoutes } from '@polusai/compute-common';
import LoggerController from './controllers/logger.controller';

export const ComputeRoutes = express
	.Router()
	.get(DriverRoutes.FILES_CONTENT, Controller.getContent)
	.post(DriverRoutes.ROOT, Controller.createWorkflow)
	.get(DriverRoutes.STATUS, Controller.getWorkflowStatus)
	.get(DriverRoutes.LOGS, Controller.getWorkflowLogs)
	.get(DriverRoutes.JOB_LOGS, Controller.getJobLogs)
	.get(DriverRoutes.ALL_JOBS_LOGS, Controller.getAllJobsLogs)
	.get(DriverRoutes.OUTPUTS, Controller.getWorkflowOutputs)
	.get(DriverRoutes.JOBS, Controller.getWorkflowJobs)
	.put(DriverRoutes.STOP, Controller.stopWorkflow);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
export const LoggerRoutes = express.Router().get('/logs', LoggerController.getServerLogs);
