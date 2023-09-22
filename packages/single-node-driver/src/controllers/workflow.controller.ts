import { NextFunction } from "express";
import { Request, Response } from "express";
import WorkflowService from "../services/workflow.service";

class WorkflowController {

  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const cwl = req.body as any;
      const id = await WorkflowService.submit(cwl);
      if (!id) {
        console.log("Error occurred while submitting", id);
        res.status(400).send("Error occurred while submitting");
        return;
      }
      res.status(201).send(id.toString());
    } catch (error) {
      next(error);
    }
  }

  async status(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const status = await WorkflowService.status(id);
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }

  async logs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const logs = await WorkflowService.logs(id);
      res.status(200).send(logs);
    } catch (error) {
      next(error);
    }
  }

  async stop(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const status = await WorkflowService.stop(id);
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  }
}

export default new WorkflowController();
