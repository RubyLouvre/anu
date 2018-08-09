"use strict";

var _ReactWX = require("./ReactWX");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Demo() {
  this.globalData = {
    ufo: "ufo"
  };
}

Demo = _ReactWX2.default.miniCreateClass(Demo, _ReactWX2.default.Component, {
  onLaunch: function () {
    console.log('onLaunch===');
  },
  classCode: "c2715375276439749"
}, {});

App(new Demo());