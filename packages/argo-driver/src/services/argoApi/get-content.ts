import fs from 'fs';
import stream from 'stream';

require('dotenv').config();
const argoConfig = require('config');

export async function getContent(path: string) {
	const parentPath = argoConfig.argoCompute.baseDir;
	let fullPath = parentPath + '/' + path;
	fullPath = fullPath.replace(/\/\//g, '/');

	if (fs.lstatSync(fullPath).isFile()) {
		const fileStream = fs.createReadStream(fullPath);
		return { stream: fileStream };
	}

	const content = fs.readdirSync(fullPath, { withFileTypes: true });
	const filesAndDirs = content.map(item => ({
		name: item.name,
		type: item.isFile() ? 'file' : 'directory',
	}));

	const ts = new stream.Transform();
	ts.push(JSON.stringify(filesAndDirs));
	ts.push(null);
	return { stream: ts };
}
