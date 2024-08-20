import express from 'express';
import SlurmController from './controllers/slurm.controller';
import SlurmController2 from './controllers/slurm.controller2';
import HealthController from './controllers/health.controller';
import { DriverRoutes } from '@polusai/compute-common';

export const SlurmRoutes = express
	.Router()
	.post('/', SlurmController.create)
	.get('/:id/status', SlurmController.getWorkflowStatus)
	.get('/:id/logs', SlurmController.getWorkflowLogs)
	.get('/:id/outputs', SlurmController.getWorkflowOutputs)
	.get('/:id/jobs', SlurmController.getWorkflowJobs)
	.put('/:id/stop', SlurmController.stopWorkflow);

export const SlurmRoutes2 = express
	.Router()
	.post(DriverRoutes.ROOT, SlurmController2.create)
	.get(DriverRoutes.STATUS, SlurmController2.getWorkflowStatus)
	.get(DriverRoutes.LOGS, SlurmController2.getWorkflowLogs)
	.get('/:id/outputs', SlurmController2.getWorkflowOutputs)
	.get(DriverRoutes.JOBS, SlurmController2.getWorkflowJobs)
	.put(DriverRoutes.STOP, SlurmController2.stopWorkflow);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
