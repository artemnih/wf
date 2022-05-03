# User Documentation

These APIs all take JSONified CWL.

CWL website provides a series of good walkthroughs and examples (https://www.commonwl.org/)
The Compute API contains the following 4 models

- Workflows
- Plugins
- Pipelines
- Jobs

## Jobs

A job model is the individual step of a workflow. It contains the inputs, outputs, status of step and logs.

## Workflows

A computational graph that closely mimics CWL workflows. The main difference is cwlJobInputs is the JSON representation of the defined inputs for a workflow. See [CWLWorkflows](../../examples/CWLWorkflows) for example workflows.

## Plugins

The CommandLineTool of a plugin. Plugins are defined as containerized algorithms with defined inputs/outputs and UI. There are two ways of uploading plugins.

1. Upload a JSONified CommandLineTool and place the entire payload under cwlScript. See [sleep](../../examples/CLTScripts/sleep.json)
2. If you want to use our plugin JSON schema, you can upload the plugin schema and we will generate a CLT from the plugin definition. See [ome2zarr](../../examples/plugins/ome2zarr.json)
3. For reproducibile workflows, you should specify the id of your plugin once it gets created in the mongodb. This is so you can keep referring to the same plugin when building workflows.

## Pipelines

A pipeline is a saved workflow that can be reused as a computational step on its own. We sometimes call this a workflow template.

# Quick Start

If a user wants to submit a workflow to compute, they must make sure that the plugins are present in the plugins database.

As was stated in the plugins definition, you can upload plugins via the raw CLT script or you can upload a plugin schema.

/POST/plugins allows you to upload either one.

Mongo will create an object id for that plugin and you should use that key for referencing that plugin in your workflow.

All data must exist in the system you are running your workflow in.  If you want to use the argo driver, you should reference existing collections.  If you want to use the slurm driver, you should use existing directories for input data.

# Tutorial using Curl

Set environment variables COMPUTE_URL and COMPUTE_AUTH_TOKEN.

The first step of using compute is to upload plugins to the /compute/plugins endpoint
```
curl -H 'Content-Type: application/json' -H 'accept: application/json' -H "Authorization: Bearer ${COMPUTE_AUTH_TOKEN}" -X 'POST' $COMPUTE_URL/compute/plugins -d @examples/plugins/echo.json
```

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
