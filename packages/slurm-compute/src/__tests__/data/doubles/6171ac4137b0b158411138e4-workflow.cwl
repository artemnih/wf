{"cwlVersion":"v1.0","class":"Workflow","id":"hello-world-cwl","inputs":{"hello1":"string"},"outputs":{"echoOut":{"type":"File","outputSource":"echo/echoOut"},"echoErr":{"type":"File","outputSource":"echo/echoErr"}},"steps":{"echo":{"run":"/tmp/cwl/6148da6f08b2c40710890b09.cwl","in":{"message":"hello1"},"out":["echoOut","echoErr"]}}}