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

			if (decodedPath.includes('..')) {
				const errorMessage = 'Invalid path';
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}

			const responseAxios = await ExplorerRepository.getContent(driver, decodedPath, req.headers.authorization as string);
			const stream = responseAxios.data;

			stream.on('data', (chunk: any) => {
				res.write(chunk);
			});

			stream.on('end', () => {
				res.end();
			});

			stream.on('error', (error: any) => {
				logger.error(`Error while streaming: ${error.message}`);
				res.status(500).send('Error while streaming');
			});
		} catch (error) {
			if (error?.response?.status === 404) {
				logger.error(`File not found: ${error.message}`);
				res.status(404).send('File not found');
			} else {
				logger.error(`Error while getting content: ${error.message}`);
				res.status(500).send('Error while getting content');
			}
			next(error);
		}
	}

	async createDir(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.authorization;
			const driver = req.params.driver;
			const path = req.params[0];
			const name = req.params.name;
			const responseAxios = await ExplorerRepository.createDir(driver, path, name, token);
			res.status(200).json(responseAxios.data);
		} catch (error) {
			logger.error(`Error while creating new dir: ${error.message}`);
			res.status(500).send('Error while creating new dir');
			next(error);
		}
	}
}

export default new ExplorerController();
