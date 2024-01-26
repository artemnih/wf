# ArgoCompute

This project was generated with [lsc](https://github.com/labshare/lsc).

## Local Development

1. `npm install`
2. `npm run build`
3. `npm run start`
4. Create a .env file in the top level directory with these [environment](#environment)
5. Navigate to `http://localhost:7999/explorer/` to view the api

## Development server

Run `lsc services start` for starting the server. Navigate to `http://localhost:8000/explorer/`.

## Build

Run `lsc services build` to build the project.

## Services

The example project contains the following services' packages.

-   [Services-Cache](https://github.com/LabShare/services-cache)
-   [Services-Auth](https://github.com/LabShare/services-auth)
-   [Services-Logger](https://github.com/LabShare/services-logger)
-   [Services-Notifications](https://github.com/LabShare/services-notifications)

## Configuration

### Env Vars

## Environment

These are the relevant environment variables.

| Env Variable         | Description                          |
| -------------------- | ------------------------------------ |
| ARGO                 | URL of the Argo REST API             |
| ARGO_TOKEN           | Token for accessing Argo REST API    |
| SERVICES_AUTH_URL    | LabShare Auth API URL                |
| SERVICES_AUTH_TENANT | LabShare Auth Tenant for Argo driver |

For a local development, you only need to define ARGO, ARGO_TOKEN, SERVICES_AUTH_URL and SERVICES_AUTH_TENANT. The [defaults](config/default.js) assume localhost.

## Further help

To get more help on the shell-ui and lsc CLI go check out the
[Services CLI README](https://github.com/angular/services/blob/master/README.md).
[Loopback CLI README](https://github.com/angular/services/blob/master/README.md).
[LSC CLI README](https://loopback.io/index.html).

### Set up Argo for local development

To set up Argo Workflows on your local development environment (using Docker-desktop), follow these steps:

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Start Docker deskop
3. Install [kubectl](https://kubernetes.io/docs/tasks/tools/)
4. Install [Argo Workflows](https://argoproj.github.io/argo-workflows/quick-start/):

    `kubectl create namespace argo`

    `kubectl apply -n argo -f https://github.com/argoproj/argo-workflows/releases/download/v<<ARGO_WORKFLOWS_VERSION>>/install.yaml`

    Replace `<<ARGO_WORKFLOWS_VERSION>>` with the desired version of Argo Workflows.

5. Verify Installation:

    `kubectl get pods -n argo`

6. Access the Argo UI:

    You can access the Argo UI by running:
    `kubectl -n argo port-forward svc/argo-server 2746:2746`

    Then, open your web browser and navigate to https://localhost:2746/workflows/argo.

7. Generate an access token for Argo:

    `kubectl -n argo exec svc/argo-server  -- argo auth token`

    The token generated can be used to login in Argo UI. Additionally, create a local `token.pem` file and paste the token as the content of the file (remove `Bearer`). In the `.env` file, set ARGO to `https://localhost:2746/api/v1/workflows/argo` and reference ARGO_TOKEN as the path to `token.pem`.

8. Configure Persistent Volumes (PVs) and Persistent Volume Claims (PVCs):

    Ensure that the persistent volume and persistent volume claim are properly created. For details on how to create PVs and PVCs, refer to this [Kubernetes documentation page](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).

    For a quick setup, you can use default YAML files for basic PV and PVC configurations located in the [docs](./docs) folder. To bind the volumes, simply run the following command lines:

    `kubectl apply -f ./docs/compute-data-volume.yaml`

    `kubectl apply -f ./docs/compute-pv-claim.yaml`

Please note that these steps are for a basic local setup using Docker desktop. In production or more complex environments, additional configuration and security considerations may apply.

### Known issues

When running in local development, submitting a workflow may result in a self-signed certificate error. A quick fix is to instruct `node` to run the API while allowing untrusted certificates:

`NODE_TLS_REJECT_UNAUTHORIZED='0' npm run start`

## Deployment

Kubernetes deployment of Compute Argo driver is done using [Helm chart](../../deploy/helm/argo-driver).
