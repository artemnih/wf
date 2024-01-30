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
		let parsedInputValue = undefined;
		// TODO CHECK CWL SPEC Directory can either have a path or location attributes.

		switch ((inputValue as Record<string, string>)?.class) {
			case 'Directory':
				parsedInputValue = (inputValue as Record<string, string>)?.path;
				if (!parsedInputValue) {
					parsedInputValue = (inputValue as Record<string, string>)?.location;
				}
				break;
			default:
				parsedInputValue = inputValue as string;
				break;
		}

		if (parsedInputValue === undefined) {
			console.log([inputName, inputValue]);
			throw Error(`unable to parse cwlJobInput: ${cwlJobInput} `);
		}

		workflowInputs.push({ name: inputName, value: parsedInputValue });
	});
	return workflowInputs;
}
