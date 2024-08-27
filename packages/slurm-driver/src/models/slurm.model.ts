export interface Slurm {
	id?: string;
	cwlWorkflow: object;
	cwlJobInputs: object;
	config?: string[];
}
