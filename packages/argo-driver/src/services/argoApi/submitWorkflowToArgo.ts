import {ArgoWorklow} from '../../types';
import {axiosClient} from '.';

export function submitWorkflowToArgo(argoTemp: ArgoWorklow): void {
  axiosClient()
    .post('', JSON.stringify(argoTemp))
    .then((response) => {
      console.log('Argo workflow was submitted', response.data);
    })
    .catch(
      (error) => console.error(error)
    );
}
