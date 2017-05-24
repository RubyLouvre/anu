'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nonconfigurable;

var _utils = require('./private/utils');

function handleDescriptor(target, key, descriptor) {
  descriptor.configurable = false;
  return descriptor;
}

function nonconfigurable() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _utils.decorate)(handleDescriptor, args);
}