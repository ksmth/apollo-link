(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('apollo-link')) :
  typeof define === 'function' && define.amd ? define(['exports', 'tslib', 'apollo-link'], factory) :
  (global = global || self, factory((global.apolloLink = global.apolloLink || {}, global.apolloLink.polling = {}), global.tslib, global.apolloLink.core));
}(this, (function (exports, tslib_1, apolloLink) { 'use strict';

  var PollingLink = (function (_super) {
      tslib_1.__extends(PollingLink, _super);
      function PollingLink(pollInterval) {
          var _this = _super.call(this) || this;
          _this.pollInterval = pollInterval;
          return _this;
      }
      PollingLink.prototype.request = function (operation, forward) {
          var _this = this;
          return new apolloLink.Observable(function (observer) {
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
  }(apolloLink.ApolloLink));

  exports.PollingLink = PollingLink;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
