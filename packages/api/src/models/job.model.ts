export interface Job {
  id?: string;
  workflowId: string;
  driver: string;
  stepName: string;
  scriptPath: string;
  commandLineTool: object;
  inputs: object;
  outputs: object;
  status: string;
  dateCreated?: string;
  dateFinished?: string;
  owner?: string;
}