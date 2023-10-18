export interface CwlJobInput {
  name: string;
  value: string | string[];
}

/**
 * 
 * @param cwlJobInputs the original cwlJobInputs coming from the compute API
 * @returns parsed cwlJobInputs. 
 * In particular Directory are converted to string for conform argo spec.
 * TODO CHECK CWL spec to see if all cases are covered
 */
export function parseCwlJobInputs(cwlJobInputs: object): CwlJobInput[] {
  const workflowInputs: CwlJobInput[] = [];
  Object.entries(cwlJobInputs).forEach((cwlJobInput) => {
    let [ inputName, inputValue ] = cwlJobInput
    //TODO CHECK CWL SPEC Directory can either have a path or location attributes.
    //Check if the semantic is equivalent
    if (inputValue.class === 'Directory') {
      let val = inputValue?.path;
      if(!val) {
        val = inputValue?.location;
      }
      inputValue = val
    }
    workflowInputs.push({name: inputName, value: inputValue});
  });
  return workflowInputs;
}
