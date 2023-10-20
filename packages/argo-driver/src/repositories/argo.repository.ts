import {cwlToArgo} from '../services/CWLToArgo';
import {CwlWorkflow, ComputeJob, CwlJobInputs} from '../types';
import {submitWorkflowToArgo} from '../services/argoApi';

class ArgoRepository {
  /**
   * Request the execution of a CWL workflow with Argo.
   * @param cwlWorkflow the original cwlWorkflow
   * @param cwlJobInputs the orginal cwlJobInputs
   * @param computeJobs jobs are the step definitions stored by compute
   */
  public createWorkflow(
    cwlWorkflow: CwlWorkflow,
    cwlJobInputs: CwlJobInputs,
    computeJobs: ComputeJob[],
  ) {

    const argoWorkflow = cwlToArgo(cwlWorkflow, cwlJobInputs, computeJobs);

    const _argoWorkflow = JSON.stringify(argoWorkflow, null, 2);
    console.debug(`submitting workflow to argo api : ${_argoWorkflow}`);

    submitWorkflowToArgo(argoWorkflow);
  }
}

export default new ArgoRepository();