(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('apollo-link'), require('graphql/execution/execute')) :
  typeof define === 'function' && define.amd ? define(['exports', 'tslib', 'apollo-link', 'graphql/execution/execute'], factory) :
  (global = global || self, factory((global.apolloLink = global.apolloLink || {}, global.apolloLink.schema = {}), global.tslib, global.apolloLink.core, global.graphql.execute));
}(this, (function (exports, tslib_1, apolloLink, execute) { 'use strict';

  var SchemaLink = (function (_super) {
      tslib_1.__extends(SchemaLink, _super);
      function SchemaLink(_a) {
          var schema = _a.schema, rootValue = _a.rootValue, context = _a.context;
          var _this = _super.call(this) || this;
          _this.schema = schema;
          _this.rootValue = rootValue;
          _this.context = context;
          return _this;
      }
      SchemaLink.prototype.request = function (operation) {
          var _this = this;
          return new apolloLink.Observable(function (observer) {
              Promise.resolve(execute.execute(_this.schema, operation.query, _this.rootValue, typeof _this.context === 'function'
                  ? _this.context(operation)
                  : _this.context, operation.variables, operation.operationName))
                  .then(function (data) {
                  if (!observer.closed) {
                      observer.next(data);
                      observer.complete();
                  }
              })
                  .catch(function (error) {
                  if (!observer.closed) {
                      observer.error(error);
                  }
              });
          });
      };
      return SchemaLink;
  }(apolloLink.ApolloLink));

  exports.SchemaLink = SchemaLink;
  exports.default = SchemaLink;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
