import { WorkflowExecutionRequest } from '../models';
import ArgoRepository from '../repositories/argo.repository';
import { CwlWorkflow, ComputeJob } from '../types';
import {
  statusOfArgoWorkflow,
  getArgoJobsAndUpdateComputeJobs,
  stopArgoWorkflow,
} from '../services/argoApi';
import { getTargetFromJobs } from '../services';
import { Target } from '../services/getTargetFromJobs';
import { NextFunction, Request, Response } from 'express';

class ArgoController {

  /**
   * Create an argo workflow and submit it for execution.
   * @param req 
   * @param res 
   * @param next 
   */
  async createArgoWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      // parsing request body as is
      const request = req.body as WorkflowExecutionRequest;
      const argoResponse = ArgoRepository.createWorkflow(
        request.cwlWorkflow as CwlWorkflow,
        request.cwlJobInputs,
        request.jobs as ComputeJob[], // jobs are the step definitions stored by compute
      );
      res.status(201).json(argoResponse);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = statusOfArgoWorkflow(id);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const jobs = await getArgoJobsAndUpdateComputeJobs(id);
      const result = getTargetFromJobs(jobs, Target.logs);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowOutputs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const jobs = await getArgoJobsAndUpdateComputeJobs(id);
      const result = getTargetFromJobs(jobs, Target.outputs);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = getArgoJobsAndUpdateComputeJobs(id);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  stopWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = stopArgoWorkflow(id);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default new ArgoController();
