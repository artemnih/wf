import { NextFunction, Request, Response } from 'express';
import { readFile } from 'fs/promises';

export class LoggerController {
	async getServerLogs(req: Request, res: Response, next: NextFunction) {
		try {
			const logs = await readFile('combined.log', 'utf-8');
			res.status(200).send(logs);
		} catch (error) {
			next(error);
		}
	}
}

export default new LoggerController();
