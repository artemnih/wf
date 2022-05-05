cwlVersion: v1.0
$namespaces:
    CustomResourceRexquirement: 'https://polus.org'
$schemas:
    - 'https://schema.org/version/latest/schemaorg-current-https.rdf'
id: filepatterngen
class: CommandLineTool
'CustomResourceRequirement:gpu': '0'
requirements:
    DockerRequirement: {dockerPull: 'kevinpatrickhannon/file-pattern-json:0.0.1'}
    InlineJavascriptRequirement: {}
    ResourceRequirement: {}
    InitialWorkDirRequirement: {listing: [{entry: $(inputs.outDir), writable: true}]}
stdout: filepattern.out
stderr: filepattern.err
baseCommand:
    - python3
    - /opt/executables/main.py
inputs:
    inpDir: {type: Directory, inputBinding: {prefix: '--inpDir'}}
    pattern: {type: 'string?', inputBinding: {prefix: '--pattern'}}
    chunkSize: {type: 'int?', inputBinding: {prefix: '--chunkSize'}, default: 30}
    groupBy: {type: 'string?', inputBinding: {prefix: '--groupBy'}}
    outDir: {type: Directory, inputBinding: {prefix: '--outDir'}}
outputs:
    filePatterns: 
        type: Directory 
        outputBinding: 
            glob: "$(inputs.outDir.basename)"

