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
				throw new Error('Invalid path');
			}
			const respo = await ExplorerService.getContent(decodedPath);
			respo.stream.pipe(res);
		} catch (error) {
			if (error.code === 'ENOENT') {
				res.status(404).send('File not found');
			} else {
				logger.error(`Error while getting content: ${error.message}`);
				res.status(500).send('Error while getting content: ' + error.message);
			}
			next(error);
		}
	}

	async createDir(req: Request, res: Response, next: NextFunction) {
		try {
			const path = req.params[0];
			const name = req.params.name;

			if (path.includes('..') || name.includes('..')) {
				logger.error('Invalid path');
				throw new Error('Invalid path');
			}

			if (name === '') {
				logger.error('Name cannot be empty');
				throw new Error('Name cannot be empty');
			}

			const illegalChars = ['/', '\\', '?', '%', '*', ':', '|', '"', '<', '>', '.'];

			if (illegalChars.some(char => name.includes(char))) {
				logger.error('Name contains illegal characters');
				throw new Error('Name contains illegal characters');
			}

			const respo = await ExplorerService.createDir(path, name);
			res.status(200).json(respo.data);
		} catch (error) {
			logger.error(`Error while creating new dir: ${error.message}`);
			res.status(500).send('Error while creating new dir: ' + error.message);
			next(error);
		}
	}
}
