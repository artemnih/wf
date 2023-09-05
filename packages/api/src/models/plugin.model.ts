export interface Plugin {
    id?: string;
    cwlId?: string;
    name: string;
    version: string;
    title?: string;
    description?: string;
    containerId?: string;
    inputs?: object[];
    outputs?: object[];
    customInputs?: boolean;
    ui?: object[];
    author?: string;
    institution?: string;
    website?: string;
    citation?: string;
    repository?: string;
    baseCommand?: string[];
    stdout?: string;
    stderr?: string;
    pluginHardwareRequirements?: object;
    cwlScript?: object;
    [prop: string]: any;
}