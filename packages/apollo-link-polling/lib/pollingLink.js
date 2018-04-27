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
import { ApolloLink, Observable, } from 'apollo-link';
var PollingLink = /** @class */ (function (_super) {
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
//# sourceMappingURL=pollingLink.js.map