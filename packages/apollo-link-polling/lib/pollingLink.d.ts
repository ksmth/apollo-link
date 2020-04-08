import { ApolloLink, Operation, NextLink, FetchResult, Observable } from 'apollo-link';
export declare namespace PollingLink {
    interface PollInterval {
        (operation: Operation): number | null;
    }
}
export declare class PollingLink extends ApolloLink {
    private pollInterval;
    private timer;
    private subscription;
    constructor(pollInterval: PollingLink.PollInterval);
    request(operation: Operation, forward: NextLink): Observable<FetchResult>;
}
//# sourceMappingURL=pollingLink.d.ts.map