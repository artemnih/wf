export interface ArgoWorklow {
	namespace: string;
	serverDryRun: boolean;
	workflow: {
		apiVersion: string;
		kind: string;
		metadata: {
			name: string;
			namespace: string;
			labels: {
				'workflows.argoproj.io/archive-strategy': string;
			};
		};
		spec: {
			volumes: [
				{
					name: string;
					persistentVolumeClaim: {
						claimName: string;
					};
				},
			];
			entrypoint: string;
			templates: Array<ArgoDag | ArgoContainerTemplate>;
		};
	};
}

export interface ArgoDag {
	name: string;
	dag: {
		tasks: ArgoTaskTemplate[];
	};
}

/**
 * Each step of the workflow is represented by a
 * task template.
 */
export interface ArgoTaskTemplate {
	name: string;
	template: string;
	arguments?: {
		parameters?: ArgoTaskParameter[];
	};
	withItems?: string[];
	withParam?: string;
	dependencies?: string[];
	when?: string;
}

export interface ArgoTaskParameter {
	name: string;
	value: string;
	type?: ArgoTaskParameterType;
}

export enum ArgoTaskParameterType {
	InputPath,
	OutputPath,
	Value,
}

/**
 * Each task template is associated with a container definition
 */
// CHECK the argo spec for correct parameters typings.
export interface ArgoContainerTemplate {
	name: string;
	inputs: {
		parameters: object[];
	};
	container: {
		image: string;
		command: string[] | never;
		args: string[];
		volumeMounts: ArgoVolumeMounts[];
	};
}

export interface ArgoVolumeMounts {
	name?: string;
	readOnly?: boolean;
	mountPath?: string;
	subPath?: string;
}

export interface ArgoLogRecord {
	result: { content: string; podName: string };
}

export interface ArgoDriverConfig {
	rest: {
		port: number;
		host: string;
		noAuth: boolean;
	};
	services: {
		auth: {
			authUrl: string;
		};
	};
	argoCompute: {
		baseDir: string;
		argo: {
			argoUrl: string;
			tokenPath: string;
			namespace: string;
		};
		volumeDefinitions: {
			pvcName: string;
			name: string;
			mountPath: string;
			outputPath: string;
			subPath: string;
		};
	};
}
