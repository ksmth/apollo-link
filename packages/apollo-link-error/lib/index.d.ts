import { ApolloLink, Observable, Operation, NextLink, FetchResult } from 'apollo-link';
import { GraphQLError, ExecutionResult } from 'graphql';
import { ServerError, ServerParseError } from 'apollo-link-http-common';
export interface ErrorResponse {
    graphQLErrors?: ReadonlyArray<GraphQLError>;
    networkError?: Error | ServerError | ServerParseError;
    response?: ExecutionResult;
    operation: Operation;
    forward: NextLink;
}
export declare namespace ErrorLink {
    interface ErrorHandler {
        (error: ErrorResponse): Observable<FetchResult> | void;
    }
}
export import ErrorHandler = ErrorLink.ErrorHandler;
export declare function onError(errorHandler: ErrorHandler): ApolloLink;
export declare class ErrorLink extends ApolloLink {
    private link;
    constructor(errorHandler: ErrorLink.ErrorHandler);
    request(operation: Operation, forward: NextLink): Observable<FetchResult> | null;
}
//# sourceMappingURL=index.d.ts.map