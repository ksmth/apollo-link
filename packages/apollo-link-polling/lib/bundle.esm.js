import { __extends } from 'tslib';
import { Observable, ApolloLink } from 'apollo-link';

var PollingLink = (function (_super) {
    __extends(PollingLink, _super);
    function PollingLink(pollInterval) {
        var _this = _super.call(this) || this;
        _this.pollInterval = pollInterval;
        return _this;
    }
    PollingLink.prototype.request = function (operation, forward) {
        var _this = this;
        return new Observable(function (observer) {
            var subscriber = {
                next: function (data) {
                    observer.next(data);
                },
                error: function (error) { return observer.error(error); },
            };
            var poll = function () {
                _this.subscription.unsubscribe();
                _this.subscription = forward(operation).subscribe(subscriber);
            };
            var interval = _this.pollInterval(operation);
            if (interval !== null) {
                _this.timer = setInterval(poll, interval);
            }
            _this.subscription = forward(operation).subscribe(subscriber);
            return function () {
                if (_this.timer) {
                    clearInterval(_this.timer);
                }
                _this.subscription.unsubscribe();
            };
        });
    };
    return PollingLink;
}(ApolloLink));

export { PollingLink };
//# sourceMappingURL=bundle.esm.js.map
