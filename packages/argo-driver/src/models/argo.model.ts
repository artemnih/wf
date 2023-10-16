export interface WorkflowExecutionRequest {
  id?: number;
  cwlWorkflow: object;
  cwlJobInputs: object;
  jobs: object[];
}