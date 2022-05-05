export interface JobOutput {
  location?: string;
  basename?: string;
  class?: string;
  listing?: Object[];
  path?: string;
  size?: number;
  checksum?: string;
}

export interface OutputDict {
  [key: string]: JobOutput | JobOutput[] | string | string[] | boolean | number;
}

// For cwltool, there is a path field that gives us the local location to our files.
// For toil, they do not have this path field but we can use the location field.
// The format is file:///$FILE_PATH so we can parse the characters of file:// to get the absolute path.
// We should probably just fix this on toil side but until then, this is hack.
export const locationFromOutput = (logJson: OutputDict) => {
  if (logJson?.location) {
    const loc = logJson.location;
    return loc ? (loc as string).slice(7) : '';
  }
  if (typeof logJson === 'number') return logJson as number;
  if (typeof logJson === 'boolean') return logJson as boolean;
  if (Array.isArray(logJson)) {
    if (typeof logJson[0] === 'string') {
      return logJson as string[];
    }
  }
  return '';
};
