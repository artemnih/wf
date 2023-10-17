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
      templates: Array<ArgoDagTasks | ArgoContainerTemplate>;
    };
  };
}

export interface ArgoDagTasks {
  name: string;
  dag: {tasks: ArgoDagTaskTemplate[]};
}

/**
 * Each step of the workflow is represented by a 
 * task template.
 * Each task template identifies a template it derives from
 * (Argo Container Template) representing 
 * all computation of the same type.
 */
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
