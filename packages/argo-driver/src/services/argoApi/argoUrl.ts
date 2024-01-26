export const argoUrl = () => {
	require('dotenv').config();
	const argoConfig = require('config');
	return argoConfig.argoCompute.argo.argoUrl;
};
