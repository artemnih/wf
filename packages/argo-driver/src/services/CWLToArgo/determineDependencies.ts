export function determineDependencies(
  cwlStepIn: Record<string, string>,
): string[] {
  // Argo DAG has the following syntax to determine dependencies:
  // dependencies = ['step that this one depends on']
  // CWL does not use dag but it is determined by data flow.
  // stepA: out: [outputA]
  // stepB: in: stepA/outputA
  // This function will scan and determine dependencies.
  // We also use outputA to add the correct parameters to the next step.
  const dependencies = [];
  for (const key in cwlStepIn) {
    const token = cwlStepIn[key].split('/');
    if (token.length > 1) {
      dependencies.push(token[0]);
    }
  }
  return dependencies;
}
