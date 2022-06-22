import {ArgoWorklowTemplate} from '../../types';
import {argoApiInstance} from '.';

export function submitWorkflowToArgo(argoTemp: ArgoWorklowTemplate): void {
  argoApiInstance()
    .post('', JSON.stringify(argoTemp))
    .then((response) => {
      console.log('Argo workflow was submitted', response.data);
    })
    .catch((error) => console.error(error));
}
