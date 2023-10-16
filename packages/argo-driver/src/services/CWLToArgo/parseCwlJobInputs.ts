export interface cwlJobInput {
  name: string;
  value: string | string[];
}
export function parseCwlJobInputs(cwlJobInputs: object): cwlJobInput[] {
  const workflowInputs: cwlJobInput[] = [];
  Object.entries(cwlJobInputs).forEach((element) => {
    let val = element[1];
    if (val.class === 'Directory') {
      // TODO CHECK CWL spec to see if location is legit and then fix this
      // for now only path is supported
      val = val.path;
    }
    workflowInputs.push({name: element[0], value: val});
  });
  return workflowInputs;
}
