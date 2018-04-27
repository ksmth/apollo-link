var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ApolloLink, } from 'apollo-link';
import { OperationBatcher } from './batching';
export { OperationBatcher } from './batching';
var BatchLink = /** @class */ (function (_super) {
    __extends(BatchLink, _super);
    function BatchLink(fetchParams) {
        if (fetchParams === void 0) { fetchParams = {}; }
        var _this = _super.call(this) || this;
        var _a = fetchParams.batchInterval, batchInterval = _a === void 0 ? 10 : _a, _b = fetchParams.batchMax, batchMax = _b === void 0 ? 0 : _b, _c = fetchParams.batchHandler, batchHandler = _c === void 0 ? function () { return null; } : _c, _d = fetchParams.batchKey, batchKey = _d === void 0 ? function () { return ''; } : _d;
        _this.batcher = new OperationBatcher({
            batchInterval: batchInterval,
            batchMax: batchMax,
            batchHandler: batchHandler,
            batchKey: batchKey,
        });
        //make this link terminating
        if (fetchParams.batchHandler.length <= 1) {
            _this.request = function (operation) { return _this.batcher.enqueueRequest({ operation: operation }); };
        }
        return _this;
    }
    BatchLink.prototype.request = function (operation, forward) {
        return this.batcher.enqueueRequest({
            operation: operation,
            forward: forward,
        });
    };
    return BatchLink;
}(ApolloLink));
export { BatchLink };
//# sourceMappingURL=batchLink.js.map