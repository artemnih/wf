{
   "cwlVersion": "v1.0",
   "id": "cwl-operator",
   "class": "CommandLineTool",
   "requirements": {
      "DockerRequirement": {
         "dockerPull": "polusai/cwl-file-pattern-operator:0.0.1"
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