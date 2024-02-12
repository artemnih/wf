{
  "cwlVersion": "v1.0",
  "id": "HelloWorld-1",
  "class": "CommandLineTool",
  "requirements": {
    "DockerRequirement": {
      "dockerPull": "busybox"
    }
  },
  "baseCommand": [
    "echo"
  ],
  "inputs": {
    "hello": {
      "type": "string",
      "inputBinding": {
        "prefix": "--hello"
      }
    }
  },
  "outputs": {}
}