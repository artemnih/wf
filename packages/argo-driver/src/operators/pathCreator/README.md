# Path Creator

Create paths needed by the workflow

Path creator is build as a container running python code.
It also provides templates that can be imported by the argo-driver to 
build an argo workflow.

## Build 

Run `./build-docker`

## Deploy in argo

Import `templates/pathCreatorContainerTemplate.ts` and 
`templates/pathCreatorTaskTemplate` in the argo driver.

## Implementation

NOTE : a bug in typer prevents us to pass array at the moment, so
we pass a comma separated string of all paths.