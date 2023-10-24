import {
  ArgoDagTaskTemplate,
  Step,
  BoundOutput,
  WorkflowInput,
  ArgoTaskParameter,
  ArgoTaskParameterType
} from '../../../types';

import {determineDependencies} from './determineDependencies';
import { sanitizeStepName } from './sanitizeStepName';

import path from 'path'

/**
 * Build the argo dag task template for the given step.
 * @param step a worfklow step
 * @param cwlJobInputs the parsed cwlJobInputs
 * @param boundOutputs the bound outputs
 * @returns the argo dag task template.
 */
export function buildArgoDagTaskTemplate(
    step: Step, 
    cwlJobInputs: WorkflowInput[],
    boundOutputs: BoundOutput[]) {
  
    // step names this step depends on
    const dependencies = determineDependencies(step);
  
    let { taskArgumentsParameters, scatterParam }  = createTaskParameters(step, cwlJobInputs, boundOutputs)

    mountDirectories(taskArgumentsParameters)
  
    const argoDagTemplate: ArgoDagTaskTemplate = {
      name: sanitizeStepName(`${step.name}`),
      template: sanitizeStepName(`${step.name}`),
      arguments: {
        parameters: taskArgumentsParameters,
      },
    };
  
    //TODO CHECK SCATTER 
    if (step.scatter) {
      if (Array.isArray(scatterParam)) {
        argoDagTemplate.withItems = scatterParam as string[];
      } else if(typeof scatterParam === "string") {
          argoDagTemplate.withParam = scatterParam as string;
      }
    }
  
    const sanitizeDependencies: string[] = []
    if (dependencies.length > 0) {
      for(let dependency of dependencies) {
        sanitizeDependencies.push(sanitizeStepName(dependency))
      }
      argoDagTemplate.dependencies = sanitizeDependencies;
    }
    
    return argoDagTemplate;
  }

  function mountDirectories(taskArgumentsParameters : ArgoTaskParameter[]) {
    // get configuration
    require('dotenv').config();
    const argoConfig = require('config');

    for(let param of taskArgumentsParameters) {
      if(param.type === ArgoTaskParameterType.OutputPath) {
        // outputs should be mounted in writable location 
        let argoMountPath = argoConfig.argoCompute.volumeDefinitions.outputPath
        param.value = path.join(argoMountPath, param.value)
      }
      else if(param.type === ArgoTaskParameterType.InputPath) {
        // inputs must be mounted from a read only location
        let argoMountPath = argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath
        param.value = path.join(argoMountPath, param.value)
      }
    }

    

  }
  
  function createTaskParameters(
    step: Step, 
    cwlJobInputs: WorkflowInput[],
    boundOutputs: BoundOutput[]
    ) {
        
    let scatterParam: string[] | string = '';
    const taskArgumentsParameters: ArgoTaskParameter[] = [];
    const templateName = step.name
  
    for (const stepInput in step.in) {
  
      let inputValue : string = ""
      let inputType = ArgoTaskParameterType.Value
      
       //for each input step, check if it is defined in the cwlJobInputs
      const workflowInput = cwlJobInputs.find(
        (element) => step.in[stepInput] === element.name,
      );
      
      if (workflowInput) {
        inputValue = workflowInput.value;
  
        //TODO CHECK SCATTER
        if (step.scatter === stepInput) {
          inputValue = '{{item}}';
          scatterParam = workflowInput?.value;
        } else {
          warnAboutStringArrayParameters(inputValue);
        }
  
        // if we have a directory, we have a relative path that we need to mount
        // within the container it will be executed on, either to read data or
        // to store results and potentially make them available to later steps.
        if(step.clt.inputs[stepInput]?.type == 'Directory') {
          // TODO for now we keep the previous decision of prepending paths with the
          // current step name. This may have be revisited later on.
          if(step.out.includes(stepInput)) {
            inputValue = path.join(step.name, inputValue)
            inputType = ArgoTaskParameterType.OutputPath
          }
          else {
            inputValue = inputValue
            inputType = ArgoTaskParameterType.InputPath
          }
        }
      }
      else {
        // CWL special case.  If a input depends on a previous output.
        // The input parameter has the special syntax: previoustep/outputname
        const dependentInput = step.in[stepInput].split('/');
        if (dependentInput.length !== 2) {
          throw Error(
            `Invalid ${stepInput} for step ${templateName}. 
            Should be a dependent input in the form dependentStepName/dependentInputName`,
          );
        }
        let [boundStep, boundOutput] = dependentInput
  
        const boundInput = boundOutputs.find(
          (element) => boundStep == element.stepName && boundOutput === element.outputName
        );
  
        if(boundInput) { 
          const workflowInput = cwlJobInputs.find(
            (cwlJobInput) => boundInput.inputName === cwlJobInput.name,
          );
          if(workflowInput){
            inputValue = workflowInput?.value;
  
            // If we have directory, it means we are depending on data created by a previous step.
            // We need to mount the directory into a read only location coming from the given step.
            if(step.clt.inputs[stepInput]?.type == 'Directory') {
              inputValue = path.join(boundStep, inputValue as string)
              inputType = ArgoTaskParameterType.InputPath
            }
          }
        }
      }

      const parameter = {name: `${stepInput}`, value: inputValue, type: inputType}
      taskArgumentsParameters.push(parameter);
    }
  
    return {taskArgumentsParameters, scatterParam}
  }
    
  function warnAboutStringArrayParameters(
    value: string | string[] | undefined,
  ): void {
    if (Array.isArray(value)) {
      console.warn(
        "Argo driver does not handle array parameters in the dag spec.  Please remove square brackets and pass a string list ie 'r,xy'",
      );
    }
  }
  
  