import { cwlToArgo } from './CWLToArgo';
import { CwlWorkflow, ComputeJob, CwlJobInputs } from '../types';
import { axiosClient } from './argoApi';
import { AxiosResponse } from 'axios';

export async function createWorkflow(cwlWorkflow: CwlWorkflow, cwlJobInputs: CwlJobInputs, computeJobs: ComputeJob[]) {
	const argoWorkflow = cwlToArgo(cwlWorkflow, cwlJobInputs, computeJobs);
	console.debug(`ARGO Driver: submitting workflow to argo api`);
	const result = (await axiosClient()
		.post('', JSON.stringify(argoWorkflow))
		.catch(error => console.error(error))) as AxiosResponse<any>;
	console.debug(`ARGO Driver: workflow submitted to argo api`, result.data);
	return argoWorkflow.workflow.metadata.name;
}
