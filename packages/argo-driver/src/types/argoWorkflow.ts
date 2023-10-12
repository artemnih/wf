/**
 * Model a argo workflow
 */


/**
 * Argo Workflow Template (TODO ADD LINK TO ARGO SPEC)
 */
export interface ArgoWorklowTemplate {
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
      templates: Array<ArgoDagArray | ArgoContainerTemplate>;
    };
  };
}


/**
 * Argo Container Template (TODO ADD LINK TO ARGO SPEC)
 */
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

/**
 * Argo Workflows can be represented a list of steps
 * Or as a dag of steps with dependencies.
 * 
 */
export interface ArgoDagArray {
  name: string;
  dag: {tasks: ArgoDagTaskTemplate[]};
}

export interface ArgoDagTaskTemplate {
  name: string;
  template: string;
  arguments?: {
    parameters?: object[];
  };
  withItems?: string[];
  withParam?: string;
  dependencies?: string[];
  when?: string;
}
