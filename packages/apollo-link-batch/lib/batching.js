var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Observable } from 'apollo-link';
// QueryBatcher doesn't fire requests immediately. Requests that were enqueued within
// a certain amount of time (configurable through `batchInterval`) will be batched together
// into one query.
var OperationBatcher = /** @class */ (function () {
    function OperationBatcher(_a) {
        var batchInterval = _a.batchInterval, _b = _a.batchMax, batchMax = _b === void 0 ? 0 : _b, batchHandler = _a.batchHandler, _c = _a.batchKey, batchKey = _c === void 0 ? function () { return ''; } : _c;
        this.queuedRequests = new Map();
        this.batchInterval = batchInterval;
        this.batchMax = batchMax;
        this.batchHandler = batchHandler;
        this.batchKey = batchKey;
    }
    OperationBatcher.prototype.enqueueRequest = function (request) {
        var _this = this;
        var requestCopy = __assign({}, request);
        var queued = false;
        var key = this.batchKey(request.operation);
        if (!requestCopy.observable) {
            requestCopy.observable = new Observable(function (observer) {
                if (!_this.queuedRequests.has(key)) {
                    _this.queuedRequests.set(key, []);
                }
                if (!queued) {
                    _this.queuedRequests.get(key).push(requestCopy);
                    queued = true;
                }
                //called for each subscriber, so need to save all listeners(next, error, complete)
                requestCopy.next = requestCopy.next || [];
                if (observer.next)
                    requestCopy.next.push(observer.next.bind(observer));
                requestCopy.error = requestCopy.error || [];
                if (observer.error)
                    requestCopy.error.push(observer.error.bind(observer));
                requestCopy.complete = requestCopy.complete || [];
                if (observer.complete)
                    requestCopy.complete.push(observer.complete.bind(observer));
                // The first enqueued request triggers the queue consumption after `batchInterval` milliseconds.
                if (_this.queuedRequests.get(key).length === 1) {
                    _this.scheduleQueueConsumption(key);
                }
                // When amount of requests reaches `batchMax`, trigger the queue consumption without waiting on the `batchInterval`.
                if (_this.queuedRequests.get(key).length === _this.batchMax) {
                    _this.consumeQueue(key);
                }
            });
        }
        return requestCopy.observable;
    };
    // Consumes the queue.
    // Returns a list of promises (one for each query).
    OperationBatcher.prototype.consumeQueue = function (key) {
        if (key === void 0) { key = ''; }
        var queuedRequests = this.queuedRequests.get(key);
        if (!queuedRequests) {
            return;
        }
        this.queuedRequests.delete(key);
        var requests = queuedRequests.map(function (queuedRequest) { return queuedRequest.operation; });
        var forwards = queuedRequests.map(function (queuedRequest) { return queuedRequest.forward; });
        var observables = [];
        var nexts = [];
        var errors = [];
        var completes = [];
        queuedRequests.forEach(function (batchableRequest, index) {
            observables.push(batchableRequest.observable);
            nexts.push(batchableRequest.next);
            errors.push(batchableRequest.error);
            completes.push(batchableRequest.complete);
        });
        var batchedObservable = this.batchHandler(requests, forwards) || Observable.of();
        var onError = function (error) {
            //each callback list in batch
            errors.forEach(function (rejecters) {
                if (rejecters) {
                    //each subscriber to request
                    rejecters.forEach(function (e) { return e(error); });
                }
            });
        };
        batchedObservable.subscribe({
            next: function (results) {
                if (!Array.isArray(results)) {
                    results = [results];
                }
                if (nexts.length !== results.length) {
                    var error = new Error("server returned results with length " + results.length + ", expected length of " + nexts.length);
                    error.result = results;
                    return onError(error);
                }
                results.forEach(function (result, index) {
                    // attach the raw response to the context for usage
                    requests[index].setContext({ response: result });
                    if (nexts[index]) {
                        nexts[index].forEach(function (next) { return next(result); });
                    }
                });
            },
            error: onError,
            complete: function () {
                completes.forEach(function (complete) {
                    if (complete) {
                        //each subscriber to request
                        complete.forEach(function (c) { return c(); });
                    }
                });
            },
        });
        return observables;
    };
    OperationBatcher.prototype.scheduleQueueConsumption = function (key) {
        var _this = this;
        if (key === void 0) { key = ''; }
        setTimeout(function () {
            if (_this.queuedRequests.get(key) && _this.queuedRequests.get(key).length) {
                _this.consumeQueue(key);
            }
        }, this.batchInterval);
    };
    return OperationBatcher;
}());
export { OperationBatcher };
//# sourceMappingURL=batching.js.map