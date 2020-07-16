export interface Driver {
    compute(script: string): Promise<any>;
}