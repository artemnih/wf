import { Request, Response, NextFunction } from 'express';
import { ExplorerRepository } from '../repositories/explorer.repository';
import { logger } from '../utils';

class ExplorerController {
	async getContent(req: Request, res: Response, next: NextFunction) {
		try {
			logger.info(`Getting content at: ${req.url}`);

			const driver = req.params.driver;
			const wildcard = req.params[0];
			const decodedPath = decodeURIComponent(wildcard);

			// Prevent directory traversal
			if (decodedPath.includes('..')) {
				const errorMessage = 'Invalid path detected';
				logger.error(errorMessage);
				return res.status(400).send(errorMessage); // Return 400 for invalid paths
			}

			// Fetch content using the ExplorerRepository
			const responseAxios = await ExplorerRepository.getContent(driver, decodedPath, req.headers.authorization as string);
			const stream = responseAxios.data;

			// Stream content directly to the response
			stream.pipe(res);

			// Handle stream errors
			stream.on('error', (error: any) => {
				logger.error(`Error while streaming: ${error.message}`);
				res.status(500).send('Error while streaming content');
			});
		} catch (error) {
			// Handle file not found
			if (error?.response?.status === 404) {
				logger.error(`File not found: ${error.message}`);
				return res.status(404).send('File not found');
			}
			// Handle other errors
			logger.error(`Error while getting content: ${error.message}`);
			res.status(500).send('Error while getting content');
			next(error); // Pass the error to the next middleware
		}
	}

	async createDir(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization;
			const driver = req.params.driver;
			const path = req.params[0];
			const responseAxios = await ExplorerRepository.createDir(driver, path, token);
			res.status(200).json(responseAxios.data);
		} catch (error) {
			logger.error(`Error while creating new dir: ${error.message}`);
			res.status(500).send('Error while creating new dir');
			next(error);
		}
	}

	async uploadFiles(req: Request, res: Response, next: NextFunction) {
		try {
			logger.info('Uploading files');

			const token = req.headers.authorization;
			const driver = req.params.driver;
			const path = req.params[0];
			const files = req.files as Express.Multer.File[];

			// Validate that the path does not contain directory traversal sequences
			if (path.includes('..')) {
				logger.error('Invalid path detected');
				return res.status(400).send('Invalid path');
			}

			// Validate that there are files to upload
			if (!files || files.length === 0) {
				logger.error('No files were uploaded');
				return res.status(400).send('No files were uploaded');
			}

			// Log the number of files being uploaded
			logger.info(`Uploading ${files.length} files to path: ${path}`);

			// Call the ExplorerRepository to upload the files
			const responseAxios = await ExplorerRepository.uploadFiles(driver, path, files, token);

			// Return the response from the repository
			res.status(200).json(responseAxios.data);
		} catch (error) {
			logger.error(`Error while uploading files: ${error.message}`);
			res.status(500).send('Error while uploading files');
			next(error);
		}
	}

	async downloadFile(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization;
			const driver = req.params.driver;
			const path = req.params[0];

			const responseAxios = await ExplorerRepository.downloadFile(driver, path, token);
			responseAxios.data.pipe(res);

			responseAxios.data.on('error', (error: any) => {
				logger.error(`Error while streaming file: ${error.message}`);
				res.status(500).send('Error while streaming file');
			});
		} catch (error) {
			if (error?.response?.status === 404) {
				logger.error(`File not found: ${error.message}`);
				return res.status(404).send('File not found');
			}

			logger.error(`Error while downloading file: ${error.message}`);
			res.status(500).send('Error while downloading file');
			next(error);
		}
	}

	async deleteAssets(req: Request, res: Response, next: NextFunction) {
		try {
			logger.info('Deleting assets');

			const token = req.headers.authorization;
			const driver = req.params.driver;
			const paths = req.body.paths as string[];

			const responseAxios = await ExplorerRepository.deleteAssets(driver, paths, token);
			res.status(200).json(responseAxios.data);
		} catch (error) {
			logger.error(`Error while deleting file: ${error.message}`);
			res.status(500).send('Error while deleting file');
			next(error);
		}
	}

	async rename(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization;
			const driver = req.params.driver;
			const path = req.body.path;
			const name = req.body.name;

			const responseAxios = await ExplorerRepository.rename(driver, path, name, token);
			res.status(200).json(responseAxios.data);
		} catch (error) {
			logger.error(`Error while renaming: ${error.message}`);
			res.status(500).send('Error while renaming');
			next(error);
		}
	}
}

export default new ExplorerController();
