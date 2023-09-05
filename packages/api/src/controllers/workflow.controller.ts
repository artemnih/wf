import { Workflow } from '../models';
import { WorkflowRepository } from '../repositories';
import { WorkflowCrud } from '../models';
import { NextFunction, Request, Response } from 'express';

interface Status {
  status: string;
  dateFinished: string;
}

export class WorkflowController {
  private workflowRepository: WorkflowRepository;

  constructor() {
    this.workflowRepository = new WorkflowRepository();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = req.body as Workflow;
      const token = req.headers.authorization as string;
      workflow.dateCreated = new Date().toISOString();
      const workflowCreated = await WorkflowCrud.create(workflow);
      await this.workflowRepository.submitWorkflowToDriver(workflowCreated, token);
      res.status(201).json(workflowCreated);
    } catch (error) {
      next(error);
    }
  }

  async resubmitWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.body as string;
      const token = req.headers.authorization as string;
      const foundWorkflow = await WorkflowCrud.findById(id);
      foundWorkflow.id = undefined;
      const newWorkflow = await WorkflowCrud.create(foundWorkflow);
      await this.workflowRepository.resubmitWorkflow(newWorkflow, token);
      res.status(201).json(newWorkflow);
    } catch (error) {
      next(error);
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = req.query as any;
      const workflows = await WorkflowCrud.find(filter);
      res.status(200).json(workflows);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const workflow = await WorkflowCrud.findById(id);
      res.status(200).json(workflow);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const workflow = req.body as Workflow;
      const newWorkflow = await WorkflowCrud.findOneAndUpdate({ _id: workflow.id }, workflow, { new: true });
      res.status(200).json(newWorkflow);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const foundWorkflow = await WorkflowCrud.findById(id);
      const newStatus = (await this.workflowRepository.getWorkflowStatus(id, foundWorkflow, req.headers.authorization as string)) as Status;
      foundWorkflow.status = newStatus['status'] !== foundWorkflow.status ? newStatus['status'] : foundWorkflow.status;
      if (newStatus['dateFinished']) {
        foundWorkflow.dateFinished = newStatus['dateFinished'];
      }
      await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
      res.status(200).json(newStatus);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const foundWorkflow = await WorkflowCrud.findById(id);
      const logs = await this.workflowRepository.getWorkflowLogs(id, foundWorkflow, req.headers.authorization as string);
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowOutput(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const foundWorkflow = await WorkflowCrud.findById(id);
      const outputs = await this.workflowRepository.getWorkflowOutput(id, foundWorkflow, req.headers.authorization as string);
      res.status(200).json(outputs);
    } catch (error) {
      next(error);
    }
  }

  async getWorkflowJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const foundWorkflow = await WorkflowCrud.findById(id);
      const jobs = await this.workflowRepository.getWorkflowJobs(id, foundWorkflow, req.headers.authorization as string);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  async stopWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const foundWorkflow = await WorkflowCrud.findById(id);
      await this.workflowRepository.stopWorkflow(id, foundWorkflow, req.headers.authorization as string);
      foundWorkflow.status = 'CANCELLED';
      const updated = await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async restartWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const foundWorkflow = await WorkflowCrud.findById(id);
      await this.workflowRepository.restartWorkflow(id, foundWorkflow, req.headers.authorization as string);
      foundWorkflow.status = 'RESTARTED';
      const updated = await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async pauseWorkflow(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const foundWorkflow = await WorkflowCrud.findById(id);
      await this.workflowRepository.pauseWorkflow(id, foundWorkflow, req.headers.authorization as string);
      foundWorkflow.status = 'PAUSED';
      const updated = await WorkflowCrud.findOneAndUpdate({ _id: foundWorkflow.id }, foundWorkflow, { new: true });
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async healthDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const driver = req.params.driver;
      const health = await this.workflowRepository.healthDriverCheck(driver, req.headers.authorization as string);
      res.status(200).json(health);
    } catch (error) {
      next(error);
    }
  }

}

export default new WorkflowController();