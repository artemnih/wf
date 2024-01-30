API Explorer Link:

http://$SLURM_SERVICE_HOST:$SLURM_SERVICE_PORT/explorer/

SLURM_SERVICE_HOST and SLURM_SERVICE_PORT is the host address for the head node and the port.

###

# Health endpoint

GET /compute/health
Usage: Used for health endpoint to register drivers with compute

# Slurm driver endpoints

POST /compute
Usage: internal endpoint for compute to submit workflows to our slurm driver
Takes a CWL workflow, inputs and definition of the plugins and submits to toil.

GET /compute/{id}/status

Usage: Get the status of workflow id.
Takes a workflow and reads {id}.status.json and returns that payload

GET /compute/{id}/jobs
Usage: Get the status of each step of a workflow.
Takes a workflow and calls the slurm cli to get the status of each step.
The job names are toil*job*{id}.{stepName}

GET /compute/{id}/outputs
Usage: Return the outputs of a finished workflow
For now, you can't get outputs until workflow finishes (error or success)

GET /compute/{id}/logs

Usage: Return the logs of each step of a workflow
If a workflow is running, return the real time logs in {id}-logs/
