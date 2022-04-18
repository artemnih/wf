import {readFileSync} from 'fs';
import {OutputDict} from '.';

export const readCwlOutput = (id: string) => {
  require('dotenv').config();
  const slurmConfig = require('config');

  const currentDir: string = slurmConfig.slurmCompute.data;
  const outJson = `${currentDir}/${id}.out.json`;
  try {
    const output = readFileSync(outJson, 'utf8');
    return JSON.parse(output) as OutputDict;
  } catch (error) {
    console.error(`Error passing ${outJson}`);
    console.error(error);
    return {};
  }
};
