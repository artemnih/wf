import { Response } from 'express';
import fs from 'fs';

require('dotenv').config();
const argoConfig = require('config');

export async function getContent(res: Response, url: string, search: string) {
	const index = url.indexOf(search);

	if (index === -1) {
		throw new Error('Invalid path');
	}

	const path = url.substring(index + search.length);
	const decodedPath = decodeURIComponent(path);

	if (decodedPath.includes('..')) {
		throw new Error('Invalid path');
	}

	const parentPath = argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath;
	const fullPath = parentPath + decodedPath;
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
}
