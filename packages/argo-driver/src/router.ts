import express from 'express';
import Controller from './controllers/argo.controller';
import HealthController from './controllers/health.controller';
import { DriverRoutes, ExplorerRoutes as ExplorerRoutePaths } from '@polusai/compute-common';
import LoggerController from './controllers/logger.controller';
import { ExplorerController } from './controllers/explorer.controller';
import multer from 'multer';

const explorerController = new ExplorerController();

export const ComputeRoutes = express
	.Router()
	.post(DriverRoutes.ROOT, Controller.createWorkflow)
	.get(DriverRoutes.STATUS, Controller.getWorkflowStatus)
	.get(DriverRoutes.LOGS, Controller.getWorkflowLogs)
	.get(DriverRoutes.JOB_LOGS, Controller.getJobLogs)
	.get(DriverRoutes.ALL_JOBS_LOGS, Controller.getAllJobsLogs)
	.get(DriverRoutes.OUTPUTS, Controller.getWorkflowOutputs)
	.get(DriverRoutes.JOBS, Controller.getWorkflowJobs)
	.put(DriverRoutes.STOP, Controller.stopWorkflow);

export const ExplorerRoutes = express
	.Router()
	.get(ExplorerRoutePaths.GET_CONTENT, explorerController.getContent)
	.post(ExplorerRoutePaths.CREATE_DIR, explorerController.createDir)
	.post(ExplorerRoutePaths.UPLOAD_FILES, multer().array('files'), explorerController.uploadFiles)
	.get(ExplorerRoutePaths.DOWNLOAD_FILE, explorerController.downloadFile)
	.delete(ExplorerRoutePaths.DELETE, explorerController.deleteAssets)
	.patch(ExplorerRoutePaths.RENAME, explorerController.rename);

export const HealthRoutes = express.Router().get('/check', HealthController.ping);
export const LoggerRoutes = express.Router().get('/logs', LoggerController.getServerLogs);
