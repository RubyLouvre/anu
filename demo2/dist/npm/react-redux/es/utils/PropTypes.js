'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeShape = exports.subscriptionShape = undefined;

var _index = require('../../../prop-types/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subscriptionShape = exports.subscriptionShape = _index2.default.shape({
  trySubscribe: _index2.default.func.isRequired,
  tryUnsubscribe: _index2.default.func.isRequired,
  notifyNestedSubs: _index2.default.func.isRequired,
  isSubscribed: _index2.default.func.isRequired
});

var storeShape = exports.storeShape = _index2.default.shape({
  subscribe: _index2.default.func.isRequired,
  dispatch: _index2.default.func.isRequired,
  getState: _index2.default.func.isRequired
});