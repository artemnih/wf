import {CLT} from './cwl';

/**
 * TODO What is this model coming from?
 */
export interface ComputeJob {
  id?: string;
  driver?: string;
  workflowId: string;
  commandLineTool?: CLT;
  inputs: object;
  outputs: object;
  stepName: string;
  status?: string;
  dateCreated?: string;
  dateFinished?: string;
}
