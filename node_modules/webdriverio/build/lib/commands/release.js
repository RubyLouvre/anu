"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *
 * Release touch sequence on specific element.
 *
 * @alias browser.release
 * @param {String} selector element to release on
 * @uses property/getLocation, protocol/touchUp
 * @type mobile
 *
 */

var release = function release(selector) {
  var _this = this;

  return this.getLocation(selector).then(function (res) {
    return _this.touchUp(res.x, res.y);
  });
};

exports.default = release;
module.exports = exports["default"];