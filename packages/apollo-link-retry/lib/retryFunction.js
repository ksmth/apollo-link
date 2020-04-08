"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildRetryFunction(retryOptions) {
    var _a = retryOptions || {}, retryIf = _a.retryIf, _b = _a.max, max = _b === void 0 ? 5 : _b;
    return function retryFunction(count, operation, valueOrError) {
        if (count >= max)
            return false;
        return retryIf
            ? retryIf(valueOrError, operation)
            : valueOrError instanceof Error;
    };
}
exports.buildRetryFunction = buildRetryFunction;
//# sourceMappingURL=retryFunction.js.map