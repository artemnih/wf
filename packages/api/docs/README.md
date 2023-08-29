# User Documentation

These APIs all take JSONified CWL.

CWL website provides a series of good walkthroughs and examples (https://www.commonwl.org/)
The Compute API contains the following 2 models

- Workflows
- Jobs

## Jobs

A job model is the individual step of a workflow. It contains the inputs, outputs, status of step and logs.

## Workflows

A computational graph that closely mimics CWL workflows. The main difference is cwlJobInputs is the JSON representation of the defined inputs for a workflow. See [CWLWorkflows](../../examples/CWLWorkflows) for example workflows.

# Quick Start

If a user wants to submit a workflow to compute, they must ensure that the relevant JSONified payload of the CommandLineTool is placed under the `run` section for each step.

All data must exist in the system you are running your workflow in.  If you want to use the argo driver, you should reference existing collections.  If you want to use the slurm driver, you should use existing directories for input data.

# Tutorial using Curl

Set environment variables COMPUTE_URL and COMPUTE_AUTH_TOKEN.

Submitting a workflow
```
curl -H 'Content-Type: application/json' -H 'accept: application/json' -H "Authorization: Bearer ${COMPUTE_AUTH_TOKEN}" -X 'POST' $COMPUTE_URL/compute/workflows -d @examples/CWLWorkflows/echo-argo.json
```
Once a workflow is submitted, you can grab the workflow id and use it to get information about your workflow (Status, Outputs, Logs and Jobs)

Monitor status with a workflow id

```
curl -H 'Content-Type: application/json' -H 'accept: application/json' -H "Authorization: Bearer ${COMPUTE_AUTH_TOKEN}" -X 'GET' $COMPUTE_URL/compute/workflows/${WORKFLOW_ID}/status
```

Monitor outputs of workflow id

```
curl -H 'Content-Type: application/json' -H 'accept: application/json' -H "Authorization: Bearer ${COMPUTE_AUTH_TOKEN}" -X 'GET' $COMPUTE_URL/compute/workflows/${WORKFLOW_ID}/outputs
```

Monitor logs of workflow id

```
curl -H 'Content-Type: application/json' -H 'accept: application/json' -H "Authorization: Bearer ${COMPUTE_AUTH_TOKEN}" -X 'GET' $COMPUTE_URL/compute/workflows/${WORKFLOW_ID}/logs
```

Jobs of workflow id

```
curl -H 'Content-Type: application/json' -H 'accept: application/json' -H "Authorization: Bearer ${COMPUTE_AUTH_TOKEN}" -X 'GET' $COMPUTE_URL/compute/workflows/${WORKFLOW_ID}/logs
```
