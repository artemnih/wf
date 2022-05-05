{
    "cwlVersion": "v1.0",
    "$namespaces": {
      "CustomResourceRequirement": "https://polus.org"
    },
    "$schemas": [
      "https://schema.org/version/latest/schemaorg-current-https.rdf"
    ],
    "id": "ome2zarr",
    "class": "CommandLineTool",
    "stdout": "ome_2zarr.out",
    "stderr": "ome_2zarr.err",
    "CustomResourceRequirement:gpu": "GpuVendor.none",
    "requirements": {
      "DockerRequirement": {
        "dockerPull": "kevinpatrickhannon/polus-ome-zarr-converter-plugin:test1"
      },
      "InlineJavascriptRequirement": {},
      "ResourceRequirement": {},
      "InitialWorkDirRequirement": {
        "listing": [
          {
            "entry": "$(inputs.outDir)",
            "writable": true
          }
        ]
      }
    },
    "baseCommand": ["python3", "/opt/executables/main.py"],
    "inputs": {
      "inpDir": {
        "type": "Directory",
        "inputBinding": {
          "prefix": "--inpDir"
        }
      },
      "filePattern": {
        "type": "string",
        "inputBinding": {
          "prefix": "--filePattern"
        }
      },
      "outDir": {
        "type": "Directory",
        "inputBinding": {
          "prefix": "--outDir"
        }
      }
    },
    "outputs": {
      "ome2zarroutDir": {
        "type": "Directory",
        "outputBinding": {
          "glob": "$(inputs.outDir.basename)"
        }
      },
      "ome2zarrStdOut": {
        "type": "stdout"
      },
      "ome2zarrStdErr": {
        "type": "stderr"
      }
    }
}
