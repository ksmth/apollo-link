import {
  ApolloLink,
  Observable,
  Operation,
  NextLink,
  FetchResult,
} from 'apollo-link';
import { GraphQLError, ExecutionResult } from 'graphql';
export interface ErrorResponse {
  graphQLErrors?: GraphQLError[];
  networkError?: Error;
  response?: ExecutionResult;
  operation: Operation;
}
export declare namespace ErrorLink {
  /**
   * Callback to be triggered when an error occurs within the link stack.
   */
  interface ErrorHandler {
    (error: ErrorResponse): void;
  }
}
export import ErrorHandler = ErrorLink.ErrorHandler;
export declare const onError: (errorHandler: ErrorHandler) => ApolloLink;
export declare class ErrorLink extends ApolloLink {
  private link;
  constructor(errorHandler: ErrorLink.ErrorHandler);
  request(
    operation: Operation,
    forward: NextLink,
  ): Observable<FetchResult> | null;
}
