import { WorkflowInput, CwlJobInputs } from '../../../types';

/**
 *
 * @param cwlJobInputs the original cwlJobInputs coming from the compute API
 * @returns parsed cwlJobInputs.
 * In particular Directory are converted to string for conform argo spec.
 * TODO CHECK CWL spec to see if all cases are covered
 */
export function parseCwlJobInputs(cwlJobInputs: CwlJobInputs): WorkflowInput[] {
	const workflowInputs: WorkflowInput[] = [];
	Object.entries(cwlJobInputs).forEach(cwlJobInput => {
		let [inputName, inputValue] = cwlJobInput;
		let parsedInputValue;
		//TODO CHECK CWL SPEC Directory can either have a path or location attributes.
		//Check if the semantic is equivalent
		if (typeof inputValue === 'string') {
			parsedInputValue = inputValue;
		} else if (inputValue?.class === 'Directory') {
			parsedInputValue = inputValue?.path;
			if (!parsedInputValue) {
				parsedInputValue = inputValue?.location;
			}
		}

		if (!parsedInputValue) {
			throw Error(`unable to parse cwlJobInput : ${cwlJobInput}`);
		}

		workflowInputs.push({ name: inputName, value: parsedInputValue });
	});
	return workflowInputs;
}
