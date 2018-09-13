'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        state: '未开始',
        title: 'audio',
        color: 'color:#9E9E9E;',
        audio: {
            src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
            poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
            name: '此时此刻',
            author: '许巍',
            loop: false,
            controls: true
        }
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    onPlay: function () {
        this.setState({
            state: '正在播放',
            color: 'color:#4CAF50;'
        });
    },
    onPause: function () {
        this.setState({
            state: '暂停',
            color: 'color:#FFEB3B;'
        });
    },
    onError: function () {
        this.setState({
            state: '出错了',
            color: 'color:#F44336;'
        });
    },
    onEnded: function () {
        this.setState({
            state: '停止',
            color: 'color:#607D8B;'
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { style: 'display:flex;flex-direction:column;align-items:center;padding-top:25rpx;' }, h('view', null, h('audio', { src: this.state.audio.src, loop: this.state.audio.loop, controls: this.state.audio.controls, poster: this.state.audio.poster, name: this.state.audio.name, author: this.state.audio.author, onPlay: this.onPlay, onEnd: this.onEnded, onPause: this.onPause, onError: this.onError, 'data-play-uid': 'e3654', 'data-class-uid': 'c2297', 'data-instance-uid': this.props.instanceUid, 'data-end-uid': 'e3744', 'data-pause-uid': 'e3836', 'data-error-uid': 'e3930' })), h('view', { style: 'font-size: 32rpx;' }, h('text', { style: 'color: #999;' }, '\u5F53\u524D\u72B6\u6001\uFF1A'), h('text', { style: this.state.color }, this.state.state)));;
    },
    classUid: 'c2297'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/audio/index'));

exports.default = P;