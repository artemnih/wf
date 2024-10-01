import { NextFunction, Request, Response } from 'express';
import { IExplorerController } from '@polusai/compute-common';
import { logger } from '../services/logger';
import ExplorerService from '../services/explorer.service';

export class ExplorerController implements IExplorerController {
	async getContent(req: Request, res: Response, next: NextFunction) {
		try {
			logger.info('Getting content:' + req.url);
			const wildcard = req.params[0];
			const decodedPath = decodeURIComponent(wildcard);
			if (decodedPath.includes('..')) {
				logger.error('Invalid path');
				return res.status(400).send('Invalid path');
			}
			const result = await ExplorerService.getContent(decodedPath);
			result.stream.pipe(res);

			result.stream.on('error', streamError => {
				logger.error(`Error while streaming file: ${streamError.message}`);
				res.status(500).send('Error while streaming file');
			});
		} catch (error) {
			if (error.code === 'ENOENT') {
				logger.error(`File not found: ${error.message}`);
				return res.status(404).send('File not found');
			} else {
				logger.error(`Error while getting content: ${error.message}`);
				return res.status(500).send('Error while getting content: ' + error.message);
			}
		}
	}

	async createDir(req: Request, res: Response, next: NextFunction) {
		try {
			const path = req.params[0];

			logger.info(`Creating new directory at: ${path}`);

			if (path.includes('..')) {
				logger.error('Invalid path');
				return res.status(400).send('Invalid path');
			}

			if (!path.trim()) {
				logger.error('Directory name cannot be empty');
				return res.status(400).send('Directory name cannot be empty');
			}

			if (path === '') {
				logger.error('Name cannot be empty');
				throw new Error('Name cannot be empty');
			}

			const illegalChars = /[?%*:|"<>.]/;
			if (illegalChars.test(path)) {
				logger.error('Directory name contains illegal characters');
				return res.status(400).send('Directory name contains illegal characters');
			}

			// Call the service to create the directory
			const result = await ExplorerService.createDir(path);

			// Send success response
			return res.status(200).json({ message: 'Directory created', data: result.data });
		} catch (error) {
			// Log and handle errors
			logger.error(`Error while creating new directory: ${error.message}`);
			return res.status(500).send('Error while creating new directory: ' + error.message);
		}
	}

	async uploadFiles(req: Request, res: Response, next: NextFunction) {
		try {
			const pathToTarget = req.params[0]; // The path where files should be uploaded
			const files = req.files as Express.Multer.File[]; // Files uploaded via Multer

			// Validate that the path does not contain directory traversal sequences
			if (pathToTarget.includes('..')) {
				logger.error('Invalid path detected');
				return res.status(400).send('Invalid path');
			}

			if (!files || files.length === 0) {
				return res.status(400).send('No files were uploaded');
			}

			// Log the upload attempt
			logger.info(`Received request to upload files to path: ${pathToTarget}`);

			// Call the service to handle the file upload
			const result = await ExplorerService.uploadFiles(pathToTarget, files);

			// Return success response
			return res.status(200).json(result);
		} catch (error) {
			logger.error(`Error in uploading files: ${error.message}`);
			return res.status(500).send('Error while uploading files');
		}
	}

	async downloadFile(req: Request, res: Response, next: NextFunction) {
		try {
			const pathToTarget = req.params[0];

			if (pathToTarget.includes('..')) {
				logger.error('Invalid path detected');
				return res.status(400).send('Invalid path');
			}

			const result = await ExplorerService.downloadFile(pathToTarget);
			result.stream.pipe(res);

			result.stream.on('error', streamError => {
				logger.error(`Error while streaming file: ${streamError.message}`);
				return res.status(500).send('Error while streaming file');
			});
		} catch (error) {
			if (error.code === 'ENOENT') {
				logger.error(`File not found: ${error.message}`);
				return res.status(404).send('File not found');
			} else {
				logger.error(`Error while downloading file: ${error.message}`);
				return res.status(500).send('Error while downloading file');
			}
		}
	}

	async deleteAssets(req: Request, res: Response, next: NextFunction) {
		try {
			const paths = req.body.paths;

			for (const p of paths) {
				if (p.includes('..')) {
					logger.error('Invalid path detected');
					return res.status(400).send('Invalid path');
				}
			}

			const result = await ExplorerService.deleteAssets(paths);
			return res.status(200).json(result);
		} catch (error) {
			logger.error(`Error while deleting file: ${error.message}`);
			return res.status(500).send('Error while deleting file');
		}
	}

	async rename(req: Request, res: Response, next: NextFunction) {
		try {
			const name = req.body.name;
			const path = req.body.path;

			if (name.includes('..') || path.includes('..')) {
				logger.error('Invalid path detected');
				return res.status(400).send('Invalid path');
			}

			if (!name.trim()) {
				logger.error('Directory name cannot be empty');
				return res.status(400).send('Directory name cannot be empty');
			}

			if (name === '') {
				logger.error('Name cannot be empty');
				throw new Error('Name cannot be empty');
			}

			const illegalChars = /[?%*:|"<>.]/;
			if (illegalChars.test(name)) {
				logger.error('Directory name contains illegal characters');
				return res.status(400).send('Directory name contains illegal characters');
			}

			const result = await ExplorerService.rename(path, name);
			return res.status(200).json(result);
		} catch (error) {
			logger.error(`Error while renaming file: ${error.message}`);
			return res.status(500).send('Error while renaming file');
		}
	}
}
