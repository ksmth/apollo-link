"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_link_1 = require("apollo-link");
var PollingLink = (function (_super) {
    tslib_1.__extends(PollingLink, _super);
    function PollingLink(pollInterval) {
        var _this = _super.call(this) || this;
        _this.pollInterval = pollInterval;
        return _this;
    }
    PollingLink.prototype.request = function (operation, forward) {
        var _this = this;
        return new apollo_link_1.Observable(function (observer) {
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
}(apollo_link_1.ApolloLink));
exports.PollingLink = PollingLink;
//# sourceMappingURL=pollingLink.js.map