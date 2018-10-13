'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        imgPath: ''
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    chooseImage: function () {
        _ReactWX2.default.api.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
        }).then(res => {
            this.setState({
                imgPath: res.tempFilePaths
            });
        }).fail(res => {
            this.setState({
                imgPath: res.tempFilePaths.toString()
            });
        });
    },
    sendRequest: function () {
        _ReactWX2.default.api.request({
            url: 'test.php',
            data: {
                x: 1,
                y: 1
            }
        }).then(function (res) {
            // eslint-disable-next-line
            console.log(res);
        }).catch(function () {
            _ReactWX2.default.api.showModal({
                title: '提示',
                content: '服务器出错了',
                success: function (res) {
                    if (res.confirm) {
                        // eslint-disable-next-line
                        console.log('用户点击确定');
                    } else if (res.cancel) {
                        // eslint-disable-next-line
                        console.log('用户点击取消');
                    }
                }
            });
        });
    },
    getLocation: function () {
        _ReactWX2.default.api.getLocation({
            type: 'wgs84'
        }).then(function (res) {
            return _ReactWX2.default.api.showModal({
                title: '提示',
                content: 'latitude: ' + res.latitude + ',  longitude: ' + res.longitude
            });
        }).then(function (res) {
            if (res.confirm) {
                // eslint-disable-next-line
                console.log('用户点击确定');
            } else if (res.cancel) {
                // eslint-disable-next-line
                console.log('用户点击取消');
            }
        }).catch(function () {});
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container async-job-list' }, h('view', { className: 'async-job-list-item' }, h('view', null, 'upload image'), this.state.imgPath ? h('image', { src: this.state.imgPath }) : null, h('button', { onTap: this.chooseImage, 'data-tap-uid': 'e6016',
            'data-class-uid': 'c3556' }, 'choose image')), h('view', { className: 'async-job-list-item' }, h('view', null, 'send request'), h('button', { onTap: this.sendRequest, 'data-tap-uid': 'e6416', 'data-class-uid': 'c3556' }, 'send request')), h('view', { className: 'async-job-list-item' }, h('view', null, 'get location'), h('button', { onTap: this.getLocation, 'data-tap-uid': 'e6816', 'data-class-uid': 'c3556' }, 'get location')));
    },
    classUid: 'c3556'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/api/index'));

exports.default = P;