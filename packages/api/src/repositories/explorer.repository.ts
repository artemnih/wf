import axios from 'axios';
import DriverRepository from './driver.repository';

export class ExplorerRepository {
	static async getContent(driver: string, path: string, token: string) {
		const driverUrl = DriverRepository.getDriver(driver).url;
		return axios.get(`${driverUrl}/compute/files/content/${path}`, {
			headers: { authorization: token },
			responseType: 'stream',
		});
	}
}

export default new ExplorerRepository();
