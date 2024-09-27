import { assert } from 'console';
import { DriverCrud, Driver } from '../models/driver.model';
import NodeCache from 'node-cache';
import { logger } from '../utils';

const DRIVER_CACHE_KEY = 'drivers';
const DRIVER_CACHE_TTL = 3600;
const DRIVER_CACHE_CHECK_PERIOD = 120;

class DriverRepository {
	#driverCache = new NodeCache({ stdTTL: DRIVER_CACHE_TTL, checkperiod: DRIVER_CACHE_CHECK_PERIOD });

	async getByName(name: string): Promise<Driver> {
		assert(name, 'Driver name is required');

		const drivers = this.#driverCache.get(DRIVER_CACHE_KEY) as Driver[];
		if (drivers) {
			const driver = drivers.find(d => d.name === name);
			if (driver) {
				return driver;
			}
		}

		const allDrivers = await this.getAll();
		this.#driverCache.set(DRIVER_CACHE_KEY, allDrivers);

		const driver = allDrivers.find(d => d.name === name);
		if (!driver) {
			logger.error(`Driver with name "${name}" was not found`);
			throw new Error(`Driver with name "${name}" was not found`);
		}

		return driver;
	}

	async getDriverUrl(name: string): Promise<string> {
		assert(name, 'Driver name is required');
		const driver = await this.getByName(name);
		return driver.url;
	}

	async getAll(): Promise<Driver[]> {
		const foundDrivers = await DriverCrud.find();
		return foundDrivers;
	}

	async getById(id: string): Promise<Driver | null> {
		assert(id, 'Driver id is required');
		return DriverCrud.findById(id);
	}

	async create(driver: Driver): Promise<Driver> {
		assert(driver, 'Driver is required');
		return DriverCrud.create(driver);
	}

	async update(id: string, driver: Driver): Promise<Driver | null> {
		assert(id, 'Driver id is required');
		assert(driver, 'Driver is required');
		this.#driverCache.del(DRIVER_CACHE_KEY);
		return DriverCrud.findByIdAndUpdate(id, driver, { new: true });
	}

	async delete(id: string): Promise<Driver | null> {
		assert(id, 'Driver id is required');
		this.#driverCache.del(DRIVER_CACHE_KEY);
		return DriverCrud.findByIdAndDelete(id);
	}
}

export default new DriverRepository();
