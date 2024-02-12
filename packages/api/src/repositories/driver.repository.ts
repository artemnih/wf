import { Dictionary } from '@polusai/compute-common';
import ConfigService from '../services/config.service';
import { IDriver } from '../types';

// for now get drivers from config. Later we can get from a database
class DriverRepository {
	#drivers: Dictionary<IDriver> = {};

	async loadDrivers() {
		// todo: get drivers from a database here
		// const drivers = await Driver.getAll();

		const drivers = ConfigService.getConfig().compute.drivers;
		this.#drivers = drivers;
	}

	getDrivers() {
		return this.#drivers;
	}

	getDriver(driverId: string) {
		if (!this.#drivers[driverId]) {
			console.log('Driver not found');
			throw new Error('Driver not found');
		}
		return this.#drivers[driverId];
	}
}

export default new DriverRepository();
