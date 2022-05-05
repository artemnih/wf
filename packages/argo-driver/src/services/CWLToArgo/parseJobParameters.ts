export interface JobParameters {
  name: string;
  value: string | string[];
}
export function parseJobParameters(cwlJobParams: object): JobParameters[] {
  const jobParameters: JobParameters[] = [];
  Object.entries(cwlJobParams).forEach((element) => {
    let val = element[1];
    if (val.class === 'Directory') {
      val = val.path;
    }
    jobParameters.push({name: element[0], value: val});
  });
  return jobParameters;
}
