import { Request, Response, NextFunction } from 'express';
import { ExplorerRepository } from '../repositories/explorer.repository';
import { logger } from '../utils';

class ExplorerController {
	async getContent(req: Request, res: Response, next: NextFunction) {
		try {
			const driver = req.params.driver;
			logger.info(`Getting content for workflow: ${req.url}`);
			const search = `/files/content/${driver}/`;
			const index = req.url.indexOf(search);
			if (index === -1) {
				const errorMessage = 'Invalid path';
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}
			const path = req.url.substring(index + search.length);
			const decodedPath = decodeURIComponent(path);

			if (decodedPath.includes('..')) {
				const errorMessage = 'Invalid path';
				logger.error(errorMessage);
				throw new Error(errorMessage);
			}

			const responseAxios = await ExplorerRepository.getContent(driver, path, req.headers.authorization as string);
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
				logger.error(`Error while getting workflow output: ${error.message}`);
				res.status(500).send('Error while getting workflow output');
			}
			next(error);
		}
	}
}

export default new ExplorerController();
