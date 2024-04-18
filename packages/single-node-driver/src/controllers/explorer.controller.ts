import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

const ROOT_PATH = '/Users/admin/r';
// const ROOT_PATH = '/';

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

			const fullPath = ROOT_PATH + decodedPath;
			console.log('Full path:', fullPath);

			// check if path is a file
			if (fs.lstatSync(fullPath).isFile()) {
				const fileStream = fs.createReadStream(fullPath);
				fileStream.pipe(res);
				return;
			}

			const content = fs.readdirSync(fullPath, { withFileTypes: true });
			const files = content
				.filter(item => item.isFile())
				.map(item => ({
					name: item.name,
					type: 'file',
				}));
			const dirs = content
				.filter(item => item.isDirectory())
				.map(item => ({
					name: item.name,
					type: 'directory',
				}));

			// concat files and dirs
			const filesAndDirs = files.concat(dirs);

			// stream the response
			res.writeHead(200, {
				'Content-Type': 'application/json',
			});

			res.write(JSON.stringify(filesAndDirs));
			res.end();
		} catch (error) {
			next(error);
		}
	}
}

export default new ExplorerController();
