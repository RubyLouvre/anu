'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        state: '正在加载',
        src: 'https://static.rolandreed.cn/images/articles/JavaScript-Coercion/JavaScript.jpg',
        mode: 'scaleToFill',
        modes: [{
            mode: 'scaleToFill',
            text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
        }, {
            mode: 'aspectFit',
            text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
        }, {
            mode: 'aspectFill',
            text: 'aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来'
        }, {
            mode: 'top',
            text: 'top：不缩放图片，只显示图片的顶部区域'
        }, {
            mode: 'bottom',
            text: 'bottom：不缩放图片，只显示图片的底部区域'
        }, {
            mode: 'center',
            text: 'center：不缩放图片，只显示图片的中间区域'
        }, {
            mode: 'left',
            text: 'left：不缩放图片，只显示图片的左边区域'
        }, {
            mode: 'right',
            text: 'right：不缩放图片，只显示图片的右边边区域'
        }, {
            mode: 'top left',
            text: 'top left：不缩放图片，只显示图片的左上边区域'
        }, {
            mode: 'top right',
            text: 'top right：不缩放图片，只显示图片的右上边区域'
        }, {
            mode: 'bottom left',
            text: 'bottom left：不缩放图片，只显示图片的左下边区域'
        }, {
            mode: 'bottom right',
            text: 'bottom right：不缩放图片，只显示图片的右下边区域'
        }]
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    onError: function () {
        this.setState({
            state: '出错了',
            color: 'color:#F44336;'
        });
    },
    onLoad: function () {
        this.setState({
            state: '已加载',
            color: 'color:#4CAF50;'
        });
    },
    changeType: function (mode) {
        // eslint-disable-next-line
        this.setState({
            mode
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { style: 'display:flex;flex-direction:column;align-items:center;padding-top:25rpx;' }, h('view', null, h('image', { src: this.state.src, mode: this.state.mode, onLoad: this.onLoad, onError: this.onError, 'data-load-uid': 'e5264', 'data-class-uid': 'c3861', 'data-instance-uid': this.props.instanceUid, 'data-error-uid': 'e5356' })), h('view', { style: 'font-size: 32rpx;' }, h('text', { style: 'color: #999;' }, '\u5F53\u524D\u72B6\u6001\uFF1A'), h('text', { style: this.state.color }, this.state.state)), h('scroll-view', null, this.state.modes.map(function (mode, index) {
            return h('view', { style: 'font-size: 32rpx;', key: index }, h('button', { key: index, style: 'color: #999;', onTap: this.changeType.bind(this, mode.mode), 'data-tap-uid': 'e6815', 'data-class-uid': 'c3861', 'data-instance-uid': this.props.instanceUid, 'data-key': index }, '\u4F7F\u7528 ', mode.mode), h('view', null, mode.text));
        }, this)));;
    },
    classUid: 'c3861'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/image/index'));

exports.default = P;