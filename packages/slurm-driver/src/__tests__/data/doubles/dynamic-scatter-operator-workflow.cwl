{
	"cwlVersion": "v1.2",
	"class": "Workflow",
	"id": "620ac880b9473c00178e1fea",
	"requirements": {
		"ScatterFeatureRequirement": {},
		"InlineJavascriptRequirement": {}
	},
	"inputs": {
		"file-pattern-input": "Directory",
		"pattern": "string",
		"file-pattern-output": "Directory",
		"chunkSize": "int"
	},
	"outputs": {
		"ome2zarroutDir": {
			"type": "Directory[]",
			"outputSource": ["ome2zarr/ome2zarroutDir"]
		},
		"ome2zarrStdOut": {
			"type": "File[]",
			"outputSource": ["ome2zarr/ome2zarrStdOut"]
		},
		"ome2zarrStdErr": {
			"type": "File[]",
			"outputSource": ["ome2zarr/ome2zarrStdErr"]
		}
	},
   "steps": {
      "patternGenerator": {
         "run": "file-pattern-gen.cwl",
         "in": {
            "inpDir": "file-pattern-input",
            "pattern": "pattern",
            "outDir": "file-pattern-output",
            "chunkSize": "chunkSize"
         },
         "out": [
            "filePatterns"
         ]
      },
	  "cwlOperator": {
		"run": "src/__tests__/data/doubles/cwl-filepattern-plugin.cwl",
		"in": {
			"input": "patternGenerator/filePatterns"
		},
		"out": ["filePatterns"]
	  },
      "ome2zarr": {
         "scatter": "filePattern",
         "run": "tif-zarr.cwl",
         "in": {
            "filePattern": "cwlOperator/filePatterns",
            "inpDir": "file-pattern-input",
            "outDir": "file-pattern-output"
         },
         "out": [
            "ome2zarroutDir",
            "ome2zarrStdOut",
            "ome2zarrStdErr"
         ]
      }
   }
}