import express from 'express';
import WorkflowController from './controllers/workflow.controller';
import HealthController from './controllers/health.controller';
import { DriverRoutes } from '@polusai/compute-common';

export const WorkflowRoutes = express
	.Router()
	.post(DriverRoutes.ROOT, WorkflowController.createWorkflow)
	.get(DriverRoutes.STATUS, WorkflowController.getWorkflowStatus)
	.get(DriverRoutes.LOGS, WorkflowController.getWorkflowLogs)
	.get(DriverRoutes.JOB_LOGS, WorkflowController.getJobLogs)
	.get(DriverRoutes.ALL_JOBS_LOGS, WorkflowController.getAllJobsLogs)
	.get(DriverRoutes.OUTPUTS, WorkflowController.getWorkflowOutputs)
	.get(DriverRoutes.JOBS, WorkflowController.getWorkflowJobs)
	.put(DriverRoutes.STOP, WorkflowController.stop);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
