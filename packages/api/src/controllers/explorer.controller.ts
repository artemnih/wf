import { Request, Response, NextFunction } from 'express';
import { ExplorerRepository } from '../repositories/explorer.repository';

class ExplorerController {
	async getContent(req: Request, res: Response, next: NextFunction) {
		try {
			const driver = req.params.driver;
			console.log('Getting content for workflow:', req.url);
			const path = req.url.split(`/files/content/${driver}/`)[1];
			const decodedPath = decodeURIComponent(path);
			
			if (decodedPath.includes('..')) {
				throw new Error('Invalid path');
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
				console.log('Error while streaming:', error);
				res.status(500).send('Error while getting workflow output');
			});
		} catch (error) {
			res.status(500).send('Error while getting workflow output');
			next(error);
		}
	}
}

export default new ExplorerController();
