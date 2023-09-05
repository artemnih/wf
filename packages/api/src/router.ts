import express from "express";
import WorkflowController from "./controllers/workflow.controller";
import HealthController from "./controllers/health.controller";

export default express
  .Router()
  .post("/workflows", WorkflowController.create)
  .post("/workflows/:id/resubmit", WorkflowController.resubmitWorkflow)
  .get("/workflows", WorkflowController.find)
  .get("/workflows/:id", WorkflowController.findById)
  .patch("/workflows/:id", WorkflowController.updateById)
  .get("/workflows/:id/status", WorkflowController.getWorkflowStatus)
  .get("/workflows/:id/logs", WorkflowController.getWorkflowLogs)
  .get("/workflows/:id/output", WorkflowController.getWorkflowOutput)
  .get("/workflows/:id/jobs", WorkflowController.getWorkflowJobs)
  .put("/workflows/:id/stop", WorkflowController.stopWorkflow)
  .put("/workflows/:id/restart", WorkflowController.restartWorkflow)
  .put("/workflows/:id/pause", WorkflowController.pauseWorkflow)
  .get("/health/:driver", WorkflowController.healthDriver)

  .get("/health", HealthController.ping);
