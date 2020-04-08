import { Operation } from 'apollo-link';
export interface RetryFunction {
    (count: number, operation: Operation, valueOrError: any): boolean | Promise<boolean>;
}
export interface RetryFunctionOptions {
    max?: number;
    retryIf?: (valueOrError: any, operation: Operation) => boolean | Promise<boolean>;
}
export declare function buildRetryFunction(retryOptions?: RetryFunctionOptions): RetryFunction;
//# sourceMappingURL=retryFunction.d.ts.map