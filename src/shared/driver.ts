export interface Driver {
  getType(): string;
}

export abstract class BaseDriver implements Driver {
  constructor(n: string) { }
  abstract getType(): string;
}