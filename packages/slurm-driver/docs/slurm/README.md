# Slurm driver for compute platform

# API Description

Detailed description of [API](api/README.md)

# User documentation is WIPP

# Pre reqs

1. Deployed with access to slurm (squeue, sacct, sbatch etc)
2. Compute is pointing a head node to redirect workflows
3. Port 7998 is open on the head node

# Setting up Slurm-compute

1. We use toil as our backend for running on clusters
2. git clone https://github.com/DataBiosphere/toil.git toil
3. Create a virtual environment.
4. source \$TOIL_ENV/bin/activate
5. make prepare
6. make develop extras=[cwl]
7. git clone LabShare/slurm-compute.git
8. npm ci
9. npm run build
10. npm run start

# Useful npm scripts

a) npm run build

b) npm run start

-   Starts local server on port 7998

c) npm run test:unit

# Environment Variables

| Env Variable      | Description                       |
| ----------------- | --------------------------------- |
| SLURM_TEMP_DIR    | Current working directory of toil |
| HPC_SCHEDULER     | HPC Scheduler used                |
| SERVICES_AUTH_URL | URL for auth api                  |

# Example of deployment on Slurm HPC cluster

The following are instructions for setting up slurm-compute on a HPC cluster. We create a service account that runs all the slurm workflows.

1. Open 7998 port for Ingress from World on the HPC Login Node

2. Install gcc, npm, node-js, python and singularity on HPC Login Node, Compute and GPU Images (or build with space in shared environment)

3. Create the service account (Login and Controller)

4. Add service account to the labshare-compute POSIX group

5. Add service account to the Slurm DataBase Account labshare-compute

6. mkdir /software/manual/polus_apps
7. Chown to service account user
8. cd /software/manual/polus_apps/
9. Following [directions](#setting-up-slurm-compute), build toil
10. git clone git@github.com:labShare/slurm-compute.git
11. source ~/toil/bin/activate
12. cd /software/manual/polus_apps/slurm-compute/
13. npm adduser
14. npm ci
15. Set [environment](#environment-variables)
16. npm run start
