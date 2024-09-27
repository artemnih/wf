import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { Readable } from 'stream';
import { CONFIG } from '../config';
import { logger } from './logger';

class ExplorerService {
	async getContent(pathToTarget: string) {
		try {
			const baseDir = CONFIG.argoCompute.baseDir;
			const fullPath = path.join(baseDir, pathToTarget); // Safely join paths

			const stat = await fsPromises.lstat(fullPath); // Asynchronous lstat

			if (stat.isFile()) {
				const fileStream = fs.createReadStream(fullPath);
				return { stream: fileStream };
			}

			const content = await fsPromises.readdir(fullPath, { withFileTypes: true });
			const filesAndDirs = content.map(item => ({
				name: item.name,
				type: item.isFile() ? 'file' : 'directory',
			}));

			const jsonStream = Readable.from(JSON.stringify(filesAndDirs));
			return { stream: jsonStream };
		} catch (error) {
			logger.error(`Error retrieving content for ${pathToTarget}:`, error);
			throw error;
		}
	}

	async createDir(pathToTarget: string) {
		const baseDir = CONFIG.argoCompute.baseDir;
		const fullPath = path.join(baseDir, pathToTarget);

		logger.info(`Creating new directory at: ${fullPath}`);

		try {
			if (fs.existsSync(fullPath)) {
				return { data: 'Directory already exists' };
			}

			const res = await fsPromises.mkdir(fullPath, { recursive: true });
			return { data: res };
		} catch (error) {
			throw new Error(`Error creating directory: ${error.message}`);
		}
	}

	async uploadFiles(uploadDir: string, files: Express.Multer.File[]) {
		const baseDir = CONFIG.argoCompute.baseDir; // Base directory where files are stored
		const fullPath = path.join(baseDir, uploadDir); // The target directory

		logger.info(`Uploading files to: ${fullPath}`);

		try {
			// Ensure the target directory exists, throw if it does not
			if (!fs.existsSync(fullPath)) {
				logger.error(`Target directory does not exist: ${fullPath}`);
				throw new Error('Target directory does not exist');
			}

			// Upload files concurrently
			await Promise.all(
				files.map(async file => {
					const filePath = path.join(fullPath, file.originalname);
					await fsPromises.writeFile(filePath, file.buffer);
				}),
			);

			return { message: 'Files uploaded successfully' };
		} catch (error) {
			logger.error(`Error while uploading files to: ${fullPath}, Error: ${error.message}`);
			throw new Error(`Error uploading files: ${error.message}`);
		}
	}
}

export default new ExplorerService();
