'use strict';

var _ReactWX = require('ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
import './pages/my/index';
import './pages/classify/index';
import './pages/cart/index';
import './pages/details/index';
import './pages/brand/index';
import './pages/list/index';
*/

function Demo() {
    this.globalData = {
        userInfo: null
    };
}

Demo = _ReactWX2.default.miniCreateClass(Demo, _ReactWX2.default.Component, {
    onLaunch: function () {
        // eslint-disable-next-line
        console.log('App launched');
        //调用登录接口
        wx.login({
            success: function (r) {
                if (r.code) {
                    // eslint-disable-next-line
                    let code = r.code;
                    wx.getUserInfo({
                        success: function () {
                            // console.log('res', res);
                        }
                    });
                }
            }
        });
    },
    classUid: 'c1986'
}, {});

// eslint-disable-next-line

App(new Demo());