import { Operation } from 'apollo-link';
export interface DelayFunction {
    (count: number, operation: Operation, valueOrError: any): number;
}
export interface DelayFunctionOptions {
    initial?: number;
    max?: number;
    jitter?: boolean;
}
export declare function buildDelayFunction(delayOptions?: DelayFunctionOptions): DelayFunction;
//# sourceMappingURL=delayFunction.d.ts.map