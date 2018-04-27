(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('apollo-link'), require('subscriptions-transport-ws')) :
    typeof define === 'function' && define.amd ? define(['exports', 'apollo-link', 'subscriptions-transport-ws'], factory) :
    (factory((global.apolloLink = global.apolloLink || {}, global.apolloLink.ws = {}),global.apolloLink.core,global.subscriptionsTransportWs));
}(this, (function (exports,apolloLink,subscriptionsTransportWs) { 'use strict';

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
    var WebSocketLink = /** @class */ (function (_super) {
        __extends(WebSocketLink, _super);
        function WebSocketLink(paramsOrClient) {
            var _this = _super.call(this) || this;
            if (paramsOrClient instanceof subscriptionsTransportWs.SubscriptionClient) {
                _this.subscriptionClient = paramsOrClient;
            }
            else {
                _this.subscriptionClient = new subscriptionsTransportWs.SubscriptionClient(paramsOrClient.uri, paramsOrClient.options, paramsOrClient.webSocketImpl);
            }
            return _this;
        }
        WebSocketLink.prototype.request = function (operation) {
            return this.subscriptionClient.request(operation);
        };
        return WebSocketLink;
    }(apolloLink.ApolloLink));

    exports.WebSocketLink = WebSocketLink;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
