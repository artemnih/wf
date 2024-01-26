/* eslint-disable @typescript-eslint/no-misused-promises */
import { expect } from '@loopback/testlab';
import { ArgoJobStatus, getPodNodes } from '../../services/argoApi';
import { getJobsFromArgoApi } from '../../services/argoApi/getJobsFromArgoApi';
import { readFileSync } from 'fs';
import { buildContainerUrl } from '../../services/argoApi/buildContainerUrl';
require('dotenv').config();
const argoConfig = require('config');

describe('Test argo status api', () => {
	it('Test argo status api', async () => {
		const argoJobStatus = JSON.parse(readFileSync('src/__tests__/data/doubles/argo-test.json', 'utf8'));
		const podList = getPodNodes(argoJobStatus as ArgoJobStatus);
		const jobs = getJobsFromArgoApi('6182b31d18a40d33bc351ef0', podList);
		const absolutePath = `${argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath}`;
		const montageLog = buildContainerUrl('6182b31d18a40d33bc351ef0', '6181a1d9d8f17a0e454c3e47-1519731056');
		const recycleLog = buildContainerUrl('6182b31d18a40d33bc351ef0', '6181a1d9d8f17a0e454c3e47-2464799912');
		const actualValue = [
			{
				driver: 'ARGO',
				workflowId: '6182b31d18a40d33bc351ef0',
				status: 'Succeeded',
				stepName: 'montage',
				inputs: {
					filePattern: '{yyy}{xxx}-{r}-001.ome.tif',
					inpDir: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
					layout: 'r,xy',
					outDir: '/data/outputs/montage',
				},
				outputs: {
					montageoutDir: `${absolutePath}/montage`,
					montageLogs: `${montageLog}`,
				},
				dateCreated: '2021-11-02T20:38:50Z',
				dateFinished: '2021-11-02T20:39:02Z',
			},
			{
				driver: 'ARGO',
				workflowId: '6182b31d18a40d33bc351ef0',
				status: 'Succeeded',
				stepName: 'recycle',
				inputs: {
					groupBy: 'xyr',
					collectionRegex: '{yyy}{xxx}-{r}-00{c}.ome.tif',
					stitchRegex: '{yyy}{xxx}-{r}-00{c}.ome.tif',
					stitchDir: '/data/inputs/temp/jobs/montage',
					collectionDir: '/data/inputs/collections/611f403652091f3ee8e9c25a/images',
					outDir: '/data/outputs/recycle',
				},
				outputs: {
					recycleoutDir: `${absolutePath}/recycle`,
					recycleLogs: `${recycleLog}`,
				},
				dateCreated: '2021-11-02T20:39:10Z',
				dateFinished: '2021-11-02T20:39:13Z',
			},
		];
		expect(jobs).to.be.eql(actualValue);
	});
});
