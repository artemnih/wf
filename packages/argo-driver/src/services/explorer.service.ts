import fs from 'fs';
import path from 'path';
import stream from 'stream';
import { CONFIG } from '../config';

class ExplorerService {
	async getContent(pathToTarget: string) {
		const parentPath = CONFIG.argoCompute.baseDir;
		let fullPath = parentPath + '/' + pathToTarget;
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

	async createDir(pathToTarget: string, name: string) {
		const baseDir = CONFIG.argoCompute.baseDir;
		const fullPath = path.join(baseDir, pathToTarget, name);

		if (fs.existsSync(fullPath)) {
			return { data: 'Directory already exists' };
		}

		const res = fs.mkdirSync(fullPath, { recursive: true });
		return { data: res };
	}
}

export default new ExplorerService();
