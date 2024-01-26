/**
 * Argo has different requirements than CWL regarding stepNames
 * so we convert them if necessary.
 * TODO Check Argo Spec and CWL Spec
 * @param stepName
 * @returns
 */
export function sanitizeStepName(stepName: string): string {
	return stepName.toLowerCase().replaceAll('_', '-');
}
