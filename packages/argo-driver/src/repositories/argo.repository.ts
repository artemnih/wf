import {cwlToArgo} from '../services/CWLToArgo';
import {CwlWorkflow, MinimalJob} from '../types';
import {submitWorkflowToArgo} from '../services/argoApi';

class ArgoRepository {

  public compute(
    cwlWorkflow: CwlWorkflow,
    cwlJobParams: object,
    jobs: MinimalJob[],
  ) {
    // const _cwl_workflow = JSON.stringify(cwlWorkflow, null, 2);
    // console.log(`converting cwl workflow to argo spec : ${_cwl_workflow}`);

    const argoWorkflow = cwlToArgo(cwlWorkflow, cwlJobParams, jobs);

    const _argoWorkflow = JSON.stringify(argoWorkflow, null, 2);
    // console.log(`submitting workflow to argo api : ${_argoWorkflow}`);

    submitWorkflowToArgo(argoWorkflow);
  }
}

export default new ArgoRepository();