import {default as axios} from 'axios';
import {ArgoWorklowTemplate} from '../../types';
import {argoUrl} from './argoUrl';

export function submitWorkflowToArgo(argoTemp: ArgoWorklowTemplate): void {
  axios
    .post(argoUrl(), JSON.stringify(argoTemp))
    .then((response) => {
      console.log('Argo workflow was submitted', response.data);
    })
    .catch((error) => console.error(error));
}
