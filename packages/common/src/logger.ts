import * as winston from 'winston';

const { combine, timestamp, printf, align } = winston.format;

export function createLogger(prefix: string, filename: string) {
	return winston.createLogger({
		level: 'silly',
		format: combine(
			timestamp({
				format: 'YYYY-MM-DD hh:mm:ss.SSS A',
			}),
			align(),
			printf(info => `[${info.timestamp}] #${prefix} ${info.level}: ${info.message}`),
		),
		transports: [new winston.transports.File({ filename }), new winston.transports.Console()],
	});
}
