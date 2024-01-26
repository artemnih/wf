import { ArgoContainerTemplate, ArgoTaskTemplate, ArgoWorklow, CwlWorkflow } from '../../../types';

/**
 * Build the argo workflow
 * @param cwlWorkflow the original cwl workflow
 * @param containers the array of container templates
 * @param dagArray the array of task templates
 * @returns
 */
export function buildArgoWorkflowTemplate(
	cwlWorkflow: CwlWorkflow,
	containers: Array<ArgoContainerTemplate>,
	tasks: Array<ArgoTaskTemplate>,
): ArgoWorklow {
	require('dotenv').config();
	const argoConfig = require('config');

	return {
		namespace: argoConfig.argoCompute.namespace,
		serverDryRun: false,
		workflow: {
			apiVersion: 'argoproj.io/v1alpha1',
			kind: 'Workflow',
			metadata: {
				name: cwlWorkflow.id,
				namespace: argoConfig.argoCompute.namespace,
				labels: {
					'workflows.argoproj.io/archive-strategy': 'false',
				},
			},
			spec: {
				entrypoint: 'workflow',
				templates: [
					{
						name: 'workflow',
						dag: {
							tasks: tasks,
						},
					},
					...containers,
				],
				volumes: [
					{
						name: argoConfig.argoCompute.volumeDefinitions.name,
						persistentVolumeClaim: {
							claimName: argoConfig.argoCompute.volumeDefinitions.pvcName,
						},
					},
				],
			},
		},
	};
}
