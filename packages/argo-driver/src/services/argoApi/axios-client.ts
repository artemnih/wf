import * as fs from 'fs';
import { default as axios } from 'axios';

export const axiosClient = () => {
    require('dotenv').config();
    const argoConfig = require('config');

    if (argoConfig.argoCompute.argo.tokenPath !== '') {
        const token = fs.readFileSync(argoConfig.argoCompute.argo.tokenPath).toString().trim();
        return axios.create({
            baseURL: argoConfig.argoCompute.argo.argoUrl,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } else {
        return axios.create({ baseURL: argoConfig.argoCompute.argo.argoUrl });
    }
};