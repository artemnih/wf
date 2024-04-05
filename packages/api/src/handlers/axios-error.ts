import { AxiosError } from 'axios';
import { NextFunction, Response, Request } from 'express';

function isAxiosError<T>(error: Error | AxiosError<T>): error is AxiosError<T> {
	return 'isAxiosError' in error && error.isAxiosError;
}

export function handleHttpError(error: Error, request: Request, response: Response, next: NextFunction): void {
	if (isAxiosError(error)) {
		console.error('Axios Error', error.message);
		response.status(500).json({
			message: `Failed request`,
			method: error.config.method?.toUpperCase(),
			url: error.config.url,
		});
	} else {
		next(error);
	}
}
