This folder contains "operator" plugins. An operator plugin is a nonstandard plugin responsible for shaping data into the format this driver requests.

If you add new operator plugins, please describe them here.

cwl-filepattern-output takes a json object and outputs that to cwl.output.json. This is so we can use dynamic scatter for file patterns.
