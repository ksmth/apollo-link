import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
  NextLink,
} from 'apollo-link';
import { BatchHandler } from './batching';
export { OperationBatcher, BatchableRequest, BatchHandler } from './batching';
export declare namespace BatchLink {
  interface Options {
    /**
     * The interval at which to batch, in milliseconds.
     *
     * Defaults to 10.
     */
    batchInterval?: number;
    /**
     * The maximum number of operations to include in one fetch.
     *
     * Defaults to 0 (infinite operations within the interval).
     */
    batchMax?: number;
    /**
     * The handler that should execute a batch of operations.
     */
    batchHandler?: BatchHandler;
    /**
     * creates the key for a batch
     */
    batchKey?: (operation: Operation) => string;
  }
}
export declare class BatchLink extends ApolloLink {
  private batcher;
  constructor(fetchParams?: BatchLink.Options);
  request(
    operation: Operation,
    forward?: NextLink,
  ): Observable<FetchResult> | null;
}
