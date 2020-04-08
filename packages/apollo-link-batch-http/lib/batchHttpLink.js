"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_link_1 = require("apollo-link");
var apollo_link_http_common_1 = require("apollo-link-http-common");
var apollo_link_batch_1 = require("apollo-link-batch");
var BatchHttpLink = (function (_super) {
    tslib_1.__extends(BatchHttpLink, _super);
    function BatchHttpLink(fetchParams) {
        var _this = _super.call(this) || this;
        var _a = fetchParams || {}, _b = _a.uri, uri = _b === void 0 ? '/graphql' : _b, fetcher = _a.fetch, includeExtensions = _a.includeExtensions, batchInterval = _a.batchInterval, batchMax = _a.batchMax, batchKey = _a.batchKey, requestOptions = tslib_1.__rest(_a, ["uri", "fetch", "includeExtensions", "batchInterval", "batchMax", "batchKey"]);
        apollo_link_http_common_1.checkFetcher(fetcher);
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
            var chosenURI = apollo_link_http_common_1.selectURI(operations[0], uri);
            var context = operations[0].getContext();
            var clientAwarenessHeaders = {};
            if (context.clientAwareness) {
                var _a = context.clientAwareness, name_1 = _a.name, version = _a.version;
                if (name_1) {
                    clientAwarenessHeaders['apollographql-client-name'] = name_1;
                }
                if (version) {
                    clientAwarenessHeaders['apollographql-client-version'] = version;
                }
            }
            var contextConfig = {
                http: context.http,
                options: context.fetchOptions,
                credentials: context.credentials,
                headers: tslib_1.__assign({}, clientAwarenessHeaders, context.headers),
            };
            var optsAndBody = operations.map(function (operation) {
                return apollo_link_http_common_1.selectHttpOptionsAndBody(operation, apollo_link_http_common_1.fallbackHttpConfig, linkConfig, contextConfig);
            });
            var loadedBody = optsAndBody.map(function (_a) {
                var body = _a.body;
                return body;
            });
            var options = optsAndBody[0].options;
            if (options.method === 'GET') {
                return apollo_link_1.fromError(new Error('apollo-link-batch-http does not support GET requests'));
            }
            try {
                options.body = apollo_link_http_common_1.serializeFetchParameter(loadedBody, 'Payload');
            }
            catch (parseError) {
                return apollo_link_1.fromError(parseError);
            }
            var controller;
            if (!options.signal) {
                var _b = apollo_link_http_common_1.createSignalIfSupported(), _controller = _b.controller, signal = _b.signal;
                controller = _controller;
                if (controller)
                    options.signal = signal;
            }
            return new apollo_link_1.Observable(function (observer) {
                fetcher(chosenURI, options)
                    .then(function (response) {
                    operations.forEach(function (operation) { return operation.setContext({ response: response }); });
                    return response;
                })
                    .then(apollo_link_http_common_1.parseAndCheckHttpResponse(operations))
                    .then(function (result) {
                    observer.next(result);
                    observer.complete();
                    return result;
                })
                    .catch(function (err) {
                    if (err.name === 'AbortError')
                        return;
                    if (err.result && err.result.errors && err.result.data) {
                        observer.next(err.result);
                    }
                    observer.error(err);
                });
                return function () {
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
                    return apollo_link_http_common_1.selectURI(operation, uri) + JSON.stringify(contextConfig);
                });
        _this.batcher = new apollo_link_batch_1.BatchLink({
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
}(apollo_link_1.ApolloLink));
exports.BatchHttpLink = BatchHttpLink;
//# sourceMappingURL=batchHttpLink.js.map