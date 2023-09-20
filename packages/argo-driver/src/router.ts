import express from "express";
import ArgoController from "./controllers/argo.controller";
import HealthController from "./controllers/health.controller";

export const ArgoRoutes = express.Router()
  .post("/argo", ArgoController.create)
  .get("/argo/:id/status", ArgoController.getWorkflowOutputs)
  .get("/argo/:id/logs", ArgoController.getWorkflowLogs)
  .get("/argo/:id/outputs", ArgoController.getWorkflowOutputs)
  .get("/argo/:id/jobs", ArgoController.getWorkflowJobs)
  .put("/argo/:id/stop", ArgoController.stopWorkflow)


export const HealthRoutes = express.Router()
  .get("/check", HealthController.ping);