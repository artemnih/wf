#!/bin/bash

version=$(<VERSION)
docker build . -t polusai/argo-step-path-creator:${version}
