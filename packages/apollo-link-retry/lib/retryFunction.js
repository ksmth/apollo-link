export function buildRetryFunction(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.max, max = _c === void 0 ? 5 : _c, retryIf = _b.retryIf;
    return function retryFunction(count, operation, valueOrError) {
        if (count >= max)
            return false;
        return retryIf
            ? retryIf(valueOrError, operation)
            : valueOrError instanceof Error;
    };
}
//# sourceMappingURL=retryFunction.js.map