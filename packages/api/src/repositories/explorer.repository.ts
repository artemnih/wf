import axios from 'axios';
import DriverRepository from './driver.repository';
import { logger } from '../utils';
import FormData from 'form-data';

export class ExplorerRepository {
	static async getContent(driver: string, path: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(driver);

		return axios.get(`${driverUrl}/files/content/${path}`, {
			headers: { authorization: token },
			responseType: 'stream',
		});
	}

	static async createDir(driver: string, path: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(driver);

		const fullUrl = `${driverUrl}/files/newdir/${path}`;
		logger.info(`Creating new directory at: ${fullUrl}`);

		return axios.post(fullUrl, {
			headers: { authorization: token },
		});
	}

	static async uploadFiles(driver: string, path: string, files: Express.Multer.File[], token: string) {
		try {
			const driverUrl = await DriverRepository.getDriverUrl(driver);
			const fullUrl = `${driverUrl}/files/upload/${path}`;
			logger.info(`Uploading files to: ${fullUrl}`);

			const formData = new FormData();
			files.forEach(file => {
				formData.append('files', file.buffer, file.originalname);
			});

			const response = await axios.post(fullUrl, formData, {
				responseType: 'json',
				maxContentLength: Infinity,
				maxBodyLength: Infinity,
				headers: {
					authorization: token,
					...formData.getHeaders(),
				},
			});

			return response;
		} catch (error) {
			logger.error(`Error while uploading files: ${error.message}`);
			throw new Error(`Error while uploading files: ${error.message}`);
		}
	}

	static async downloadFile(driver: string, path: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(driver);

		return axios.get(`${driverUrl}/files/download/${path}`, {
			headers: { authorization: token },
			responseType: 'stream',
		});
	}
}

export default new ExplorerRepository();
