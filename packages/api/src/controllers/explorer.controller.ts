import { Request, Response, NextFunction } from 'express';
import { ExplorerRepository } from '../repositories/explorer.repository';

class ExplorerController {
	async getContent(req: Request, res: Response, next: NextFunction) {
		try {
			const driver = req.params.driver;
			console.log('Getting content for workflow:', req.url);
			const search = `/files/content/${driver}/`;
			const index = req.url.indexOf(search);
			if (index === -1) {
				throw new Error('Invalid path');
			}
			const path = req.url.substring(index + search.length);
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
				console.error('Error while streaming:', error);
				res.status(500).send('Error while streaming');
			});
		} catch (error) {
			if (error?.response?.status === 404) {
				console.error('File not found:', error);
				res.status(404).send('File not found');
			} else {
				console.error('Error while getting workflow output:', error);
				res.status(500).send('Error while getting workflow output');
			}
			next(error);
		}
	}
}

export default new ExplorerController();
