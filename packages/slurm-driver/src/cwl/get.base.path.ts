export const getBasePath = () => {
	require('dotenv').config();
	const slurmConfig = require('config');

	return slurmConfig.slurmCompute.data;
};
