import { ApolloLink, Operation, FetchResult, Observable } from 'apollo-link';
import { HttpOptions } from 'apollo-link-http-common';
export declare namespace BatchHttpLink {
  interface Options extends HttpOptions {
    /**
     * The maximum number of operations to include in one fetch.
     *
     * Defaults to 10.
     */
    batchMax?: number;
    /**
     * The interval at which to batch, in milliseconds.
     *
     * Defaults to 10.
     */
    batchInterval?: number;
    /**
     * Sets the key for an Operation, which specifies the batch an operation is included in
     */
    batchKey?: (operation: Operation) => string;
  }
}
/**
 * Transforms Operation for into HTTP results.
 * context can include the headers property, which will be passed to the fetch function
 */
export declare class BatchHttpLink extends ApolloLink {
  private batchInterval;
  private batchMax;
  private batcher;
  constructor(fetchParams?: BatchHttpLink.Options);
  request(operation: Operation): Observable<FetchResult> | null;
}
