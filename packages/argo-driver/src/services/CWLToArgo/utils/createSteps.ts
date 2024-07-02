import { CwlWorkflow, CLT, Step, ComputeJob } from '../../../types';
import { logger } from '../../../services/logger';

/**
 * Create Steps from the CwlWorkflows steps and the ComputeJobs.
 * We will use Step as our object model for the rest of the implementation.
 * @param cwlWorkflow
 * @param computeJobs
 * @returns the list of steps, which are the argo driver views of compute jobs.
 */
export function stepsFromWorkflow(cwlWorkflow: CwlWorkflow, computeJobs: ComputeJob[]): Step[] {
	const steps: Step[] = [];

	for (const stepName in cwlWorkflow.steps) {
		const job = computeJobs.find(job => job.stepName === stepName);

		if (!job) {
            const errorMessage = `Invalid request. Could not find a compute job for cwl workflow step : ${stepName}.`;
            logger.error(errorMessage);
            throw new Error(errorMessage);
		}

		// TODO CHECK CWL WORKFLOW
		// if cwl step inputs are objects with a source attribute,
		// let's rewrite them as plain strings.
		const workflowInputs: Record<string, string> = {};
		for (let input in cwlWorkflow.steps[stepName].in) {
			if (typeof cwlWorkflow.steps[stepName].in[input] === 'string') {
				workflowInputs[input] = cwlWorkflow.steps[stepName].in[input] as string;
			} else {
				workflowInputs[input] = (cwlWorkflow.steps[stepName].in[input] as Record<string, string>)['source'];
			}
		}

		// NOTE because the scatter implementation relies on `run`
		// to be a string, we need to get the clt from computeJob
		// rather than CwlWorklow.Step
		const clt = job.commandLineTool as CLT;

		const step: Step = {
			workflowId: cwlWorkflow.id,
			name: stepName,
			clt: clt,
			in: workflowInputs,
			out: cwlWorkflow.steps[stepName].out,
		};

		if (cwlWorkflow.steps[stepName].scatter) {
			step.scatter = cwlWorkflow.steps[stepName].scatter;
		}

		if (cwlWorkflow.steps[stepName].when) {
			step.when = cwlWorkflow.steps[stepName].when;
		}

		steps.push(step);
	}
	return steps;
}
