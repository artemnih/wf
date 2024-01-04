import express from "express";
import SlurmController from "./controllers/slurm.controller";
import HealthController from "./controllers/health.controller";

export const SlurmRoutes = express.Router()
  .post("/slurm", SlurmController.create)
  .get("/slurm/:id/status", SlurmController.getWorkflowStatus)
  .get("/slurm/:id/logs", SlurmController.getWorkflowLogs)
  .get("/slurm/:id/outputs", SlurmController.getWorkflowOutputs)
  .get("/slurm/:id/jobs", SlurmController.getWorkflowJobs)
  .put("/slurm/:id/stop", SlurmController.stopWorkflow)


export const HealthRoutes = express.Router()
  .get("/check", HealthController.ping);