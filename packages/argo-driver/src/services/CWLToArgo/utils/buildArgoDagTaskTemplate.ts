import {CwlJobInput, parseCwlJobInputs} from './parseCwlJobInputs';
import {
  ArgoDagTaskTemplate,
  Step,
  BoundOutput
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
    cwlJobInputs: CwlJobInput[],
    boundOutputs: BoundOutput[]) {
  
    // step names this step depends on
    const dependencies = determineDependencies(step);
  
    let { taskArgumentsParameters, scatterParam }  = createTaskParameters(step, cwlJobInputs, boundOutputs)
  
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
  
  function createTaskParameters(
    step: Step, 
    cwlJobInputs: CwlJobInput[],
    boundOutputs: BoundOutput[]
    ) {
  
    // get configuration
    require('dotenv').config();
    const argoConfig = require('config');
        
    let scatterParam: string[] | string = '';
    const taskArgumentsParameters: object[] = [];
    const templateName = step.name
  
    for (const stepInput in step.in) {
  
      let inputValue : string | string[] = ""
      
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
          let argoMountPath = ""
          // outputs should be in writable location. 
          // TODO for now we keep the previous decision of prepending paths with the
          // current step name. This may have be revisited later on.
          if(step.out.includes(stepInput)) {
            argoMountPath = argoConfig.argoCompute.volumeDefinitions.outputPath
            inputValue = path.join(argoMountPath , step.name, inputValue as string)
          }
          else {
            // inputs must be mounted from a read only location.
            argoMountPath = argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath
            inputValue = path.join(argoMountPath , inputValue as string)
          }
        }
        const parameter = {name: `${stepInput}`, value: inputValue}
        taskArgumentsParameters.push(parameter);
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
              const argoMountPath = argoConfig.argoCompute.volumeDefinitions.absoluteOutputPath
              inputValue = path.join(argoMountPath , boundStep, inputValue as string)
            }
            const parameter = {name: `${stepInput}`, value: inputValue}
            taskArgumentsParameters.push(parameter);
          }
        }
      }
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
  
  