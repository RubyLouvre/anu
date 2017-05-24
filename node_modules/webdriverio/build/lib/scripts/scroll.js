"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global window */
var scroll = function scroll(x, y) {
    return window.scrollTo(x, y);
};

exports.default = scroll;
module.exports = exports["default"];