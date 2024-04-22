import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

require('dotenv').config();
const config = require('config');

class ExplorerController {
	async getContent(req: Request, res: Response, next: NextFunction) {
		try {
			console.log('Getting content for workflow:', req.url);
			const path = req.url.split('/files/content')[1];
			console.log('Path:', path);
			const decodedPath = decodeURIComponent(path);
			console.log('Decoded path:', decodedPath);

			if (decodedPath.includes('..')) {
				throw new Error('Invalid path');
			}

			const fullPath = config.volume.basePath + decodedPath;
			console.log('Full path:', fullPath);

			if (fs.lstatSync(fullPath).isFile()) {
				const fileStream = fs.createReadStream(fullPath);
				fileStream.pipe(res);
				return;
			}

			const content = fs.readdirSync(fullPath, { withFileTypes: true });
			const filesAndDirs = content.map(item => ({
				name: item.name,
				type: item.isFile() ? 'file' : 'directory',
			}));

			res.writeHead(200, {
				'Content-Type': 'application/json',
			});

			res.write(JSON.stringify(filesAndDirs));
			res.end();
		} catch (error) {
			res.status(500).send(`Error while reading file: ${error.message}`);
			next(error);
		}
	}
}

export default new ExplorerController();
