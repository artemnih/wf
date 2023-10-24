import { ArgoContainerTemplate, ArgoDagTaskTemplate } from "../../../types";

export function pathCreatorContainerTemplate() : ArgoContainerTemplate {

    // retrieve configuration
    require('dotenv').config();
    const argoConfig = require('config');

    return {
        name: "path-creator",
        inputs: {
          parameters: [{name: 'paths'}],
        },
        container: {
          image:
          "polusai/argo-step-path-creator:0.0.1",
          command:
            [ "python3",
                "-m",
                "argo.steps.path_creator"],
          args: [
            '--paths',
            '{{inputs.parameters.paths}}'
          ],
          volumeMounts: [
            {
              name: argoConfig.argoCompute.volumeDefinitions.name,
              readOnly: true,
              mountPath: argoConfig.argoCompute.volumeDefinitions.mountPath,
            },
            {
              name: argoConfig.argoCompute.volumeDefinitions.name,
              mountPath: `${argoConfig.argoCompute.volumeDefinitions.outputPath}`,
              subPath: `${argoConfig.argoCompute.volumeDefinitions.subPath}`,
              readOnly: false,
            },
          ],
        },
      };
    
    }