import { Argo } from '../models';
import ArgoRepository from '../repositories/argo.repository';
import { CwlWorkflow, MinimalJob } from '../types';
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
   * Transform the CWLWorkflow and CWLjobInputs into the final Argo workflow.
   * @param req 
   * @param res 
   * @param next 
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const argo = req.body as Argo;
      const result = ArgoRepository.compute(
        argo.cwlWorkflow as CwlWorkflow,
        argo.cwlJobInputs,
        argo.jobs as MinimalJob[],
      );
      res.status(201).json(result);
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
