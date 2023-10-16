import {cwlToArgo} from '../services/CWLToArgo';
import {CwlWorkflow, ComputeJob} from '../types';
import {submitWorkflowToArgo} from '../services/argoApi';

class ArgoRepository {
  /**
   * Request the execution of a CWL workflow with Argo
   * @param cwlWorkflow
   * @param cwlJobInputs 
   * @param computeJobs TODO REMOVE those are not used since they are part of the CWL workflows
   * or at least they are duplicates.
   */
  public createWorkflow(
    cwlWorkflow: CwlWorkflow,
    cwlJobInputs: object, //TODO create a type for those
    computeJobs: ComputeJob[],
  ) {
    // const _cwl_workflow = JSON.stringify(cwlWorkflow, null, 2);
    // console.log(`converting cwl workflow to argo spec : ${_cwl_workflow}`);

    const argoWorkflow = cwlToArgo(cwlWorkflow, cwlJobInputs, computeJobs);

    const _argoWorkflow = JSON.stringify(argoWorkflow, null, 2);
    console.log(`submitting workflow to argo api : ${_argoWorkflow}`);

    submitWorkflowToArgo(argoWorkflow);
  }
}

export default new ArgoRepository();