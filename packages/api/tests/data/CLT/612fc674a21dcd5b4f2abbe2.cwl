{
  "cwlVersion": "v1.0",
  "id": "recycle",
  "class": "CommandLineTool",
  "requirements": {
    "DockerRequirement": {
      "dockerPull": "kevinpatrickhannon/polus-recycle-vector:test"
    },
    "InitialWorkDirRequirement": {
      "listing": [
        {
          "entry": "$(inputs.outDir)",
          "writable": true
        }
      ]
    }
  },
  "baseCommand": [
    "python3",
    "/opt/executables/main.py"
  ],
  "stdout": "recycle.out",
  "stderr": "recycle.err",
  "inputs": {
    "stitchDir": {
      "type": "Directory",
      "inputBinding": {
        "prefix": "--stitchDir"
      }
    },
    "collectionDir": {
      "type": "Directory",
      "inputBinding": {
        "prefix": "--collectionDir"
      }
    },
    "stitchRegex": {
      "type": "string",
      "inputBinding": {
        "prefix": "--stitchRegex"
      }
    },
    "collectionRegex": {
      "type": "string",
      "inputBinding": {
        "prefix": "--collectionRegex"
      }
    },
    "groupBy": {
      "type": "string?",
      "inputBinding": {
        "prefix": "--groupBy"
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
    "recycleOut": {
      "type": "Directory",
      "outputBinding": {
        "glob": "$(inputs.outDir.basename)"
      }
    },
    "recycleStdOut": {
      "type": "stdout"
    },
    "recycleStdErr": {
      "type": "stderr"
    }
  }
}