export interface Slurm {
	id?: number;
	cwlWorkflow: object;
	cwlJobInputs: object;
	jobs: object[];
}

export interface Slurm2 {
	id?: string;
	cwlWorkflow: object;
	cwlJobInputs: object;
	config?: string[];
}
