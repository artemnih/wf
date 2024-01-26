export interface Slurm {
	id?: number;
	cwlWorkflow: object;
	cwlJobInputs: object;
	jobs: object[];
}
