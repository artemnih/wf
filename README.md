# Compute

This project is the compute api.

## Development

- npm run test:unit
    - Runs unit testing for this application.
- npm run lint
    - Runs eslint 
- build docker image
    - docker build --build-arg=NPM_TOKEN=$NPM_TOKEN -t compute .
 - Builds a docker image using your NPM_TOKEN.

- Definitions are defined [here](docs/README.md)

## Development server

Run `npm run start` for starting the server. Navigate to `http://localhost:8000/explorer/`.

## Build

Run `npm run build` to build the project.

## Configuration

### Env Vars

For adding env vars , you can use the .env file. For more information check.
This template is using `config` package. You can change the configurations at the `config` folder.

## Further help

To get more help on the shell-ui and lsc CLI go check out the
[Services CLI README](https://github.com/angular/services/blob/master/README.md).
[Loopback CLI README](https://github.com/angular/services/blob/master/README.md).
[LSC CLI README](https://loopback.io/index.html).

## Deployment

