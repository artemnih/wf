import { default as axios } from 'axios';
import { Method } from 'axios';
import { Job } from '../models';

export const driverUrl = (driverType: string) => {
  require('dotenv').config();
  const config = require('config');
  try {
    const driverInfo = config.compute.drivers[`${driverType.toLowerCase()}Driver`];
    return `http://${driverInfo.host}:${driverInfo.port}`;
  } catch {
    throw Error('Unsupported Driver');
  }
};
export async function healthCommon(driverType: string) {
  console.log(`Health check on ${driverType}`);
  const healthUrl = `${driverUrl(driverType)}/compute/${driverType}/health`;
  console.log('health url: ', healthUrl);
  const result = await axios.get(`${healthUrl}`);
  console.log(result.data);
  return result.data;
}
export async function computeCommon(cwlWorkflow: object, cwlJobInputs: object, jobs: Job[], driver: string): Promise<object> {
  const url = driverUrl(driver);
  console.log('Url resolved to ', url);
  console.log(`Posting workflow to ${driver}`);
  console.log('cwlWorkflow', cwlWorkflow);
  console.log('cwlJobInputs', cwlJobInputs);
  console.log('jobs', jobs);
  return axios.post(`${url}/compute/${driver}`, { cwlWorkflow, cwlJobInputs, jobs });
}

export async function driverCommon(workflowId: string, driverName: string, endpoint: string, getOrPut = 'GET') {
  const url = driverUrl(driverName);
  const res = await axios.request({
    method: `${getOrPut.toLowerCase()}` as Method,
    url: `${url}/compute/${driverName}/${workflowId}/${endpoint}`,
  });
  return res.data;
}
