'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

exports.default = freeGlobal;