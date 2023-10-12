import {CwlScript} from './cwl';

/**
 * TODO What is this model coming from?
 */
export interface MinimalJob {
  id?: string;
  driver?: string;
  workflowId: string;
  commandLineTool?: CwlScript;
  inputs: object;
  outputs: object;
  stepName: string;
  status?: string;
  dateCreated?: string;
  dateFinished?: string;
}
