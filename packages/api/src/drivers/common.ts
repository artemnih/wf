import { default as axios } from 'axios';
import { Method } from 'axios';
import { Job } from '../models';

export const driverUrl = (driverType: string) => {
	require('dotenv').config();
	const config = require('config');
	try {
		const driverInfo = config.compute.drivers[`${driverType.toLowerCase()}Driver`];
		return `${driverInfo.scheme}://${driverInfo.host}:${driverInfo.port}`;
	} catch {
		throw Error('Unsupported Driver');
	}
};

export async function healthCommon(driverType: string, token: string) {
	console.log(`Health check on ${driverType}`);
	const healthUrl = `${driverUrl(driverType)}/compute/${driverType}/health`;
	console.log('health url: ', healthUrl);
	const result = await axios.get(`${healthUrl}`, {
		headers: { authorization: token },
	});
	console.log(result.data);
	return result.data;
}

export async function computeCommon(
	cwlWorkflow: object,
	cwlJobInputs: object,
	jobs: Job[],
	driver: string,
	token: string,
): Promise<object> {
	const url = driverUrl(driver);
	console.log('Url resolved to ', url);
	console.log(`Posting workflow to [${driver}]`);
	console.log('Number of jobs:', jobs.length);
	return axios.post(`${url}/compute/${driver}`, { cwlWorkflow, cwlJobInputs, jobs }, { headers: { authorization: token } });
}

export async function driverCommon(workflowId: string, driverName: string, endpoint: string, token: string, getOrPut = 'GET') {
	const url = driverUrl(driverName);
	const res = await axios.request({
		method: `${getOrPut.toLowerCase()}` as Method,
		url: `${url}/compute/${driverName}/${workflowId}/${endpoint}`,
		headers: { authorization: token },
	});
	return res.data;
}
