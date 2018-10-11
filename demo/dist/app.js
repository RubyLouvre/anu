'use strict';

var _ReactWX = require('./ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Demo() {
    this.globalData = {
        ufo: 'ufo',
        buildType: 'wx'
    };
}

Demo = _ReactWX2.default.toClass(Demo, _ReactWX2.default.Component, {
    onLaunch: function () {
        // eslint-disable-next-line
        console.log('App launched');
    },
    classUid: 'c655'
}, {});
//这样写相当于为每一个页面组件的外面都加上一个<Provider />，如果你想在页面上用到store里的数据，
//需要用react-redux的connect方法包一下，详见pages/demo/syntax/redux

// eslint-disable-next-line

App(new Demo());