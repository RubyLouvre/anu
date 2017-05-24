'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nonenumerable;

var _utils = require('./private/utils');

function handleDescriptor(target, key, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

function nonenumerable() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _utils.decorate)(handleDescriptor, args);
}