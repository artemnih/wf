This folder contains "operator" plugins. An operator plugin is a nonstandard plugin responsible for shaping data into the format this driver requests.

If you add new operator plugins, please describe them here.

- argo-filepattern-plugin takes a json object and outputs that an array to stdout. This is so we can use dynamic scatter for file patterns.

- argo-step-path-creator creates output directories needed to execute a workflow.
