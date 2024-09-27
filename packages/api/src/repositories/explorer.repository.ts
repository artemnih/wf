import axios from 'axios';
import DriverRepository from './driver.repository';
import { logger } from '../utils';

export class ExplorerRepository {
	static async getContent(driver: string, path: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(driver);

		return axios.get(`${driverUrl}/files/content/${path}`, {
			headers: { authorization: token },
			responseType: 'stream',
		});
	}

	static async createDir(driver: string, path: string, name: string, token: string) {
		const driverUrl = await DriverRepository.getDriverUrl(driver);

		const fullUrl = `${driverUrl}/files/newdir/${path}/${name}`;
		logger.info(`Creating new directory at: ${fullUrl}`);

		return axios.post(fullUrl, {
			headers: { authorization: token },
		});
	}
}

export default new ExplorerRepository();
