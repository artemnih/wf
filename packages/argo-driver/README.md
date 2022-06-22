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

- [Services-Cache](https://github.com/LabShare/services-cache)
- [Services-Auth](https://github.com/LabShare/services-auth)
- [Services-Logger](https://github.com/LabShare/services-logger)
- [Services-Notifications](https://github.com/LabShare/services-notifications)

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

## Deployment

Kubernetes deployment of Compute Argo driver is done using [Helm chart](../../deploy/helm/argo-driver).
