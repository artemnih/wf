export interface Driver {
  getName(): string;
}

export abstract class BaseDriver implements Driver {
  constructor(config: object) {}
  abstract getName(): string;
}
