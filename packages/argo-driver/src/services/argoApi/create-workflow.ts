import { cwlToArgo } from '../CWLToArgo';
import { CwlWorkflow, ComputeJob, CwlJobInputs } from '../../types';
import { axiosClient } from '.';
import { AxiosResponse } from 'axios';
import { logger } from '../logger';

export async function createWorkflow(cwlWorkflow: CwlWorkflow, cwlJobInputs: CwlJobInputs, computeJobs: ComputeJob[]) {
  const argoWorkflow = cwlToArgo(cwlWorkflow, cwlJobInputs, computeJobs);
  logger.debug('ARGO Driver: submitting workflow to argo api');
  const result = (await axiosClient()
    .post('', JSON.stringify(argoWorkflow))
    .catch(error => logger.error(error))) as AxiosResponse<any>;
  logger.debug('ARGO Driver: workflow submitted to argo api' + JSON.stringify(result.data));
  return argoWorkflow.workflow.metadata.name;
}
