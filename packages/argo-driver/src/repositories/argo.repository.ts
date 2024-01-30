import { cwlToArgo } from '../services/CWLToArgo';
import { CwlWorkflow, ComputeJob, CwlJobInputs } from '../types';
import { axiosClient } from '../services/argoApi';
import { AxiosResponse } from 'axios';

class ArgoRepository {
	/**
	 * Request the execution of a CWL workflow with Argo.
	 * @param cwlWorkflow the original cwlWorkflow
	 * @param cwlJobInputs the orginal cwlJobInputs
	 * @param computeJobs jobs are the step definitions stored by compute
	 */
	public async createWorkflow(cwlWorkflow: CwlWorkflow, cwlJobInputs: CwlJobInputs, computeJobs: ComputeJob[]) {
		const argoWorkflow = cwlToArgo(cwlWorkflow, cwlJobInputs, computeJobs);
		console.debug(`ARGO Driver: submitting workflow to argo api`);
		const result = (await axiosClient()
			.post('', JSON.stringify(argoWorkflow))
			.catch(error => console.error(error))) as AxiosResponse<any>;
		console.debug(`ARGO Driver: workflow submitted to argo api`, result.data);
		return argoWorkflow.workflow.metadata.name;
	}
}

export default new ArgoRepository();
