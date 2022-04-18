# Slurm driver for compute platform

# User documentation is WIPP

# Pre reqs

1. Deployed with access to slurm (squeue, sacct, sbatch etc)
2. Compute is pointing a head node to redirect workflows
3. Port 7998 is open on the head node

# Setting up Slurm-compute

1. We use toil as our backend for running on clusters
2. git clone https://github.com/DataBiosphere/toil.git toil
3. Create a virtual environment [python3 -m venv create toil-env]
4. source \$TOIL_ENV/bin/activate
5. make prepare
6. make develop extras=[cwl]
7. git clone git@github.com:LabShare/slurm-compute.git slurm
8. npm install
9. npm run build
10. npm run start

# Useful npm scripts

a) npm run build
b) npm run start [Starts local server on port 7998]
c) npm run test:unit

# Configurations / Environment Variables

a) SLURM_TEMP_DIR is the current working directory of toil. Directory must exist.
b) SERVICES_AUTH_URL is the labshare auth api that allows authentication.
c) SERVICES_AUTH_TENANT is the tenant of the auth service
d) HPC_SCHEDULER is the HPC system used. Default is slurm for now.
