import {cwlToArgo} from '../services/CWLToArgo';
import {CwlWorkflow, MinimalJob} from '../types';
import {submitWorkflowToArgo} from '../services/argoApi';

class ArgoRepository {

  public compute(
    cwlWorkflow: CwlWorkflow,
    cwlJobParams: object,
    jobs: MinimalJob[],
  ) {
    const argoWorkflow = cwlToArgo(cwlWorkflow, cwlJobParams, jobs);
    submitWorkflowToArgo(argoWorkflow);
  }
}

export default new ArgoRepository();