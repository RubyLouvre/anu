'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
        danmuList: [{
            text: '你好👋',
            color: 'green',
            time: 1
        }, {
            text: '干杯🍻',
            olor: 'green',
            time: 3
        }],
        controls: true,
        enableDanmu: true,
        danmuBtn: true,
        loop: true
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('view', { 'class': 'page_hd'
        }, this.state.title), h('view', { 'class': 'page_bd' }, h('view', { 'class': 'navigation' }, h('video', { src: this.state.src, controls: this.state.controls, danmuList: this.state.danmuList, loop: this.state.loop, enableDanmu: this.state.enableDanmu, danmuBtn: this.state.danmuBtn }))));;
    },
    classUid: 'c1592'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/video/index'));

exports.default = P;