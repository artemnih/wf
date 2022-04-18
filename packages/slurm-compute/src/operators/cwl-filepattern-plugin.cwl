{
   "cwlVersion": "v1.0",
   "id": "cwl-operator",
   "class": "CommandLineTool",
   "requirements": {
      "DockerRequirement": {
         "dockerPull": "kevinpatrickhannon/cwl-operator:0.0.3"
      }
   },
   "baseCommand": [
      "python3",
      "/opt/executables/main.py"
   ],
   "inputs": {
      "input": {
         "type": "Directory",
         "inputBinding": {
            "prefix": "--input"
         }
      }
   },
   "outputs": {
      "filePatterns": {
         "type": "string[]"
      }
   }
}