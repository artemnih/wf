# Compute

This package is the Compute API server.

-   Definitions are defined [here](docs/README.md)

## Local Development

1. `npm install`
2. `npm run build`
3. Start a mongodb container in another terminal
    - `docker run -p 27017:27017 -v ~/mongo/:/data -it mongo`
4. `npm run start`
5. Create a .env file in the top level directory with these [environment](#environment)
6. Navigate to `http://localhost:8000/explorer/` to view the api

## Useful npm scripts

-   npm run test:unit
    -   Runs unit testing for this application.
-   npm run lint
    -   Runs eslint
-   build docker image
    -   docker build --build-arg=NPM_TOKEN=$NPM_TOKEN -t compute .
    -   Builds a docker image using your NPM_TOKEN.

## Environment

These are the relevant environment variables.

| Env Variable          | Description                                               |
| --------------------- | --------------------------------------------------------- |
| MONGO_CONNECTION_NAME | Name of mongodb container                                 |
| ARGO_DRIVER_URL       | Name of argo-driver container                             |
| ARGO_DRIVER_PORT      | Port of argo-driver container                             |
| SLURM_DRIVER_URL      | Host name of the head node where slurm-driver is deployed |
| SLURM_DRIVER_PORT     | Port of slurm-driver                                      |
| COMPUTE_SERVICE_NAME  | Name of compute container                                 |
| SERVICES_AUTH_URL     | LabShare Auth API URL                                     |
| SERVICES_AUTH_TENANT  | LabShare Auth Tenant for Argo driver                      |

For a local development, you only need to define SLURM_DRIVER_URL, SERVICES_AUTH_URL and SERVICES_AUTH_TENANT. The [defaults](config/default.js) assume localhost.

## Deployment

Kubernetes deployment of Compute API is done using [Helm chart](../../deploy/helm/api).
