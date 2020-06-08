export interface Driver {
  getType(): string;
}

export abstract class BaseDriver implements Driver {
  constructor(config: object) {}
  abstract getType(): string;
}
