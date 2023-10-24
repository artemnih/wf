import { ArgoDagTaskTemplate } from "../../../types";

export function pathCreatorTaskTemplate(pathsToCreate : string) : ArgoDagTaskTemplate {
    return {
        name: 'path-creator',
        template: 'path-creator',
        arguments: {
            parameters: [
            {
                name: 'paths',
                value: pathsToCreate
            }
            ]
        }
    }
}