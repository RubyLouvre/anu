'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _dog = require('../../components/dog/dog');

var _dog2 = _interopRequireDefault(_dog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const e = 'e';

function P(props) {
  this.state = {
    welcome: "Welcome to mpreact"
  };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
  onClick: function () {
    console.log("test click1" + e);
  },
  onKeyDown: function () {
    console.log("test keydown");
  },
  render: function () {
    return _ReactWX2.default.createElement('view', { onTap: this.onClick, onKeyDown: this.onKeyDown }, _ReactWX2.default.createElement('view', { 'class': 'welcome' }, _ReactWX2.default.createElement('view', { 'class': 'welcome-text' }, this.state.welcome)));;
  },
  classCode: 'c3501433516345096'
}, {});

Page(_ReactWX2.default.createPage(P, "pages/index/index"));
exports.default = P;