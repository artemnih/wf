import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils';
import { Driver } from '../models/driver.model';
import DriverRepository from '../repositories/driver.repository';
import { assert } from 'console';

export class DriverController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			assert(req.body, 'Driver is required');
			const driver = req.body as Driver;
			const driverCreated = await DriverRepository.create(driver);
			res.status(201).json(driverCreated);
		} catch (error) {
			logger.error(`Error while creating driver: ${error.message}`);
			next(error);
		}
	}

	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const drivers = await DriverRepository.getAll();=
			res.status(200).json(drivers);
		} catch (error) {
			logger.error(`Error while finding drivers: ${error.message}`);
			next(error);
		}
	}

	async findById(req: Request, res: Response, next: NextFunction) {
		try {
			assert(req.params.id, 'Driver id is required');
			const id = req.params.id;
			const driver = await DriverRepository.getById(id);
			if (!driver) {
				res.status(404).json({ message: 'Driver not found' });
				return;
			}

			res.status(200).json(driver);
		} catch (error) {
			console.log(error);
			logger.error(`Error while finding driver by id: ${error.message}`);
			next(error);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			assert(req.params.id, 'Driver id is required');
			const id = req.params.id;
			const driver = req.body as Driver;
			const updatedDriver = await DriverRepository.udpate(id, driver);
			res.status(200).json(updatedDriver);
		} catch (error) {
			logger.error(`Error while updating driver: ${error.message}`);
			next(error);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			assert(req.params.id, 'Driver id is required');
			const id = req.params.id;
			const driver = await DriverRepository.delete(id);
			res.status(200).json(driver);
		} catch (error) {
			logger.error(`Error while deleting driver: ${error.message}`);
			next(error);
		}
	}

}

export default new DriverController();
