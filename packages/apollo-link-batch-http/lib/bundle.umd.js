(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('apollo-link'), require('apollo-link-http-common'), require('apollo-link-batch')) :
    typeof define === 'function' && define.amd ? define(['exports', 'apollo-link', 'apollo-link-http-common', 'apollo-link-batch'], factory) :
    (factory((global.apolloLink = global.apolloLink || {}, global.apolloLink.batchHttp = {}),global.apolloLink.core,global.apolloLink.httpCommon,global.apolloLink.batch));
}(this, (function (exports,apolloLink,apolloLinkHttpCommon,apolloLinkBatch) { 'use strict';

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __rest = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };
    /**
     * Transforms Operation for into HTTP results.
     * context can include the headers property, which will be passed to the fetch function
     */
    var BatchHttpLink = /** @class */ (function (_super) {
        __extends(BatchHttpLink, _super);
        function BatchHttpLink(fetchParams) {
            if (fetchParams === void 0) { fetchParams = {}; }
            var _this = _super.call(this) || this;
            var _a = fetchParams.uri, uri = _a === void 0 ? '/graphql' : _a, 
            // use default global fetch is nothing passed in
            fetcher = fetchParams.fetch, includeExtensions = fetchParams.includeExtensions, batchInterval = fetchParams.batchInterval, batchMax = fetchParams.batchMax, batchKey = fetchParams.batchKey, requestOptions = __rest(fetchParams, ["uri", "fetch", "includeExtensions", "batchInterval", "batchMax", "batchKey"]);
            // dev warnings to ensure fetch is present
            apolloLinkHttpCommon.checkFetcher(fetcher);
            //fetcher is set here rather than the destructuring to ensure fetch is
            //declared before referencing it. Reference in the destructuring would cause
            //a ReferenceError
            if (!fetcher) {
                fetcher = fetch;
            }
            var linkConfig = {
                http: { includeExtensions: includeExtensions },
                options: requestOptions.fetchOptions,
                credentials: requestOptions.credentials,
                headers: requestOptions.headers,
            };
            _this.batchInterval = batchInterval || 10;
            _this.batchMax = batchMax || 10;
            var batchHandler = function (operations) {
                var chosenURI = apolloLinkHttpCommon.selectURI(operations[0], uri);
                var context = operations[0].getContext();
                var contextConfig = {
                    http: context.http,
                    options: context.fetchOptions,
                    credentials: context.credentials,
                    headers: context.headers,
                };
                //uses fallback, link, and then context to build options
                var optsAndBody = operations.map(function (operation) {
                    return apolloLinkHttpCommon.selectHttpOptionsAndBody(operation, apolloLinkHttpCommon.fallbackHttpConfig, linkConfig, contextConfig);
                });
                var body = optsAndBody.map(function (_a) {
                    var body = _a.body;
                    return body;
                });
                var options = optsAndBody[0].options;
                // There's no spec for using GET with batches.
                if (options.method === 'GET') {
                    return apolloLink.fromError(new Error('apollo-link-batch-http does not support GET requests'));
                }
                try {
                    options.body = apolloLinkHttpCommon.serializeFetchParameter(body, 'Payload');
                }
                catch (parseError) {
                    return apolloLink.fromError(parseError);
                }
                var controller;
                if (!options.signal) {
                    var _a = apolloLinkHttpCommon.createSignalIfSupported(), _controller = _a.controller, signal = _a.signal;
                    controller = _controller;
                    if (controller)
                        options.signal = signal;
                }
                return new apolloLink.Observable(function (observer) {
                    // the raw response is attached to the context in the BatchingLink
                    fetcher(chosenURI, options)
                        .then(apolloLinkHttpCommon.parseAndCheckHttpResponse(operations))
                        .then(function (result) {
                        // we have data and can send it to back up the link chain
                        observer.next(result);
                        observer.complete();
                        return result;
                    })
                        .catch(function (err) {
                        // fetch was cancelled so its already been cleaned up in the unsubscribe
                        if (err.name === 'AbortError')
                            return;
                        // if it is a network error, BUT there is graphql result info
                        // fire the next observer before calling error
                        // this gives apollo-client (and react-apollo) the `graphqlErrors` and `networErrors`
                        // to pass to UI
                        // this should only happen if we *also* have data as part of the response key per
                        // the spec
                        if (err.result && err.result.errors && err.result.data) {
                            // if we dont' call next, the UI can only show networkError because AC didn't
                            // get andy graphqlErrors
                            // this is graphql execution result info (i.e errors and possibly data)
                            // this is because there is no formal spec how errors should translate to
                            // http status codes. So an auth error (401) could have both data
                            // from a public field, errors from a private field, and a status of 401
                            // {
                            //  user { // this will have errors
                            //    firstName
                            //  }
                            //  products { // this is public so will have data
                            //    cost
                            //  }
                            // }
                            //
                            // the result of above *could* look like this:
                            // {
                            //   data: { products: [{ cost: "$10" }] },
                            //   errors: [{
                            //      message: 'your session has timed out',
                            //      path: []
                            //   }]
                            // }
                            // status code of above would be a 401
                            // in the UI you want to show data where you can, errors as data where you can
                            // and use correct http status codes
                            observer.next(err.result);
                        }
                        observer.error(err);
                    });
                    return function () {
                        // XXX support canceling this request
                        // https://developers.google.com/web/updates/2017/09/abortable-fetch
                        if (controller)
                            controller.abort();
                    };
                });
            };
            batchKey =
                batchKey ||
                    (function (operation) {
                        var context = operation.getContext();
                        var contextConfig = {
                            http: context.http,
                            options: context.fetchOptions,
                            credentials: context.credentials,
                            headers: context.headers,
                        };
                        //may throw error if config not serializable
                        return apolloLinkHttpCommon.selectURI(operation, uri) + JSON.stringify(contextConfig);
                    });
            _this.batcher = new apolloLinkBatch.BatchLink({
                batchInterval: _this.batchInterval,
                batchMax: _this.batchMax,
                batchKey: batchKey,
                batchHandler: batchHandler,
            });
            return _this;
        }
        BatchHttpLink.prototype.request = function (operation) {
            return this.batcher.request(operation);
        };
        return BatchHttpLink;
    }(apolloLink.ApolloLink));

    exports.BatchHttpLink = BatchHttpLink;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
