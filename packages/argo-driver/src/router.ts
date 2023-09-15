import express from "express";
import ArgoController from "./controllers/argo.controller";
import HealthController from "./controllers/health.controller";

export const ArgoRoutes = express.Router()
  .post("/argo", ArgoController.create)
  .get("/workflows/:id/status", ArgoController.getWorkflowOutputs)
  .get("/workflows/:id/logs", ArgoController.getWorkflowLogs)
  .get("/workflows/:id/outputs", ArgoController.getWorkflowOutputs)
  .get("/workflows/:id/jobs", ArgoController.getWorkflowJobs)
  .put("/workflows/:id/stop", ArgoController.stopWorkflow)


export const HealthRoutes = express.Router()
  .get("/check", HealthController.ping);