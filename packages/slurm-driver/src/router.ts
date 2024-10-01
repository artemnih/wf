import express from 'express';
import SlurmController from './controllers/slurm.controller';
import HealthController from './controllers/health.controller';
import { DriverRoutes, ExplorerRoutes } from '@polusai/compute-common';

export const SlurmRoutes = express
	.Router()
	.get(ExplorerRoutes.GET_CONTENT, SlurmController.getContent)
	.post(DriverRoutes.ROOT, SlurmController.createWorkflow)
	.get(DriverRoutes.STATUS, SlurmController.getWorkflowStatus)
	.get(DriverRoutes.LOGS, SlurmController.getWorkflowLogs)
	.get(DriverRoutes.JOB_LOGS, SlurmController.getJobLogs)
	.get(DriverRoutes.ALL_JOBS_LOGS, SlurmController.getAllJobsLogs)
	.get(DriverRoutes.OUTPUTS, SlurmController.getWorkflowOutputs)
	.get(DriverRoutes.JOBS, SlurmController.getWorkflowJobs)
	.put(DriverRoutes.STOP, SlurmController.stopWorkflow);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
