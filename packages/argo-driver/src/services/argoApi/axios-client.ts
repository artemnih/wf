import * as fs from 'fs';
import { default as axios } from 'axios';
import { CONFIG } from '../../config';

export function axiosClient() {
	if (CONFIG.argoCompute.argo.tokenPath !== '') {
		const token = fs.readFileSync(CONFIG.argoCompute.argo.tokenPath).toString().trim();
		return axios.create({
			baseURL: CONFIG.argoCompute.argo.argoUrl,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} else {
		return axios.create({ baseURL: CONFIG.argoCompute.argo.argoUrl });
	}
}
