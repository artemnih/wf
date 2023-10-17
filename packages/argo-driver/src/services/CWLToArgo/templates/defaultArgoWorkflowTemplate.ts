import {ArgoWorklowTemplate} from '../../../types';

/**
 * Argo Workflow Template expanded with some defaults value
 * Define volume mounts
 */
export function defaultArgoWorkflowTemplate(): ArgoWorklowTemplate {
    require('dotenv').config();
    const argoConfig = require('config');
  
    return {
      namespace: 'argo',
      serverDryRun: false,
      workflow: {
        apiVersion: 'argoproj.io/v1alpha1',
        kind: 'Workflow',
        metadata: {
          name: 'hello-world-parameters-',
          namespace: 'argo',
          labels: {
            'workflows.argoproj.io/archive-strategy': 'false',
          },
        },
        spec: {
          volumes: [
            {
              name: argoConfig.argoCompute.volumeDefinitions.name,
              persistentVolumeClaim: {
                claimName: argoConfig.argoCompute.volumeDefinitions.pvcName,
              },
            },
          ],
          entrypoint: 'workflow',
          templates: [
            {
              name: 'workflow',
              dag: {
                tasks: [
                  {
                    name: 'busybox',
                    template: 'busybox',
                  },
                ],
              },
              inputs: {parameters: [{}]},
            },
            {
              name: 'busybox',
              inputs: {parameters: [{}]},
              container: {
                image: 'busybox',
                args: [],
                command: [],
                volumeMounts: [],
              },
            },
          ],
        },
      },
    };
  }