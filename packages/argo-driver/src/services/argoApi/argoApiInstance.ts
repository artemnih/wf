import * as fs from 'fs';
import {default as axios} from 'axios';
import {argoUrl} from './argoUrl';

export const argoApiInstance = () => {
    require('dotenv').config();
    const argoConfig = require('config');

    if (argoConfig.argoCompute.argo.tokenPath !== '') {
        const token = fs.readFileSync(argoConfig.argoCompute.argo.tokenPath).toString().trim();
        return axios.create({
            baseURL: argoUrl(),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } else {
        return axios.create({ baseURL: argoUrl() });
    }
};