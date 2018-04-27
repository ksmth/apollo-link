import {
  ApolloLink,
  Operation,
  NextLink,
  FetchResult,
  Observable,
} from 'apollo-link';
export declare namespace PollingLink {
  /**
   * Frequency (in milliseconds) that an operation should be polled on.
   */
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
