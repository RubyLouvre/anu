'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        defaultSize: 'default',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        plain: false,
        loading: false
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    setDisabled: function () {
        this.setState({
            disabled: !this.state.disabled
        });
    },
    setPlain: function () {
        this.setState({
            plain: !this.state.plain
        });
    },
    setLoading: function () {
        this.setState({
            loading: !this.state.loading
        });
    },
    onGotUserInfo: function (e) {
        // eslint-disable-next-line
        console.log(e);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container button-wrapper' }, h('button', { type: 'default', size: this.state.defaultSize, loading: this.state.loading, plain: this.state.plain, disabled: this.state.disabled, bindtap: 'default', 'hover-class': 'other-button-hover' }, ' ', 'default', ' '), h('button', { type: 'primary', size: this.state.primarySize, loading: this.state.loading, plain: this.state.plain, disabled: this.state.disabled, bindtap: 'primary' }, ' ', 'primary', ' '), h('button', { type: 'warn', size: this.state.warnSize, loading: this.state.loading, plain: this.state.plain, disabled: this.state.disabled, bindtap: 'warn' }, ' ', 'warn', ' '), h('button', { onTap: this.setDisabled, 'data-tap-uid': 'e4182', 'data-class-uid': 'c2794' }, '\u70B9\u51FB\u8BBE\u7F6E\u4EE5\u4E0A\u6309\u94AEdisabled\u5C5E\u6027'), h('button', { onTap: this.setPlain, 'data-tap-uid': 'e4409', 'data-class-uid': 'c2794' }, '\u70B9\u51FB\u8BBE\u7F6E\u4EE5\u4E0A\u6309\u94AEplain\u5C5E\u6027'), h('button', { onTap: this.setLoading, 'data-tap-uid': 'e4553', 'data-class-uid': 'c2794' }, '\u70B9\u51FB\u8BBE\u7F6E\u4EE5\u4E0A\u6309\u94AEloading\u5C5E\u6027'), h('button', { 'open-type': 'contact' }, '\u8FDB\u5165\u5BA2\u670D\u4F1A\u8BDD'), h('button', { 'open-type': 'getUserInfo', lang: 'zh_CN', onGetuserinfo: this.onGotUserInfo, 'data-getuserinfo-uid': 'e5104', 'data-class-uid': 'c2794' }, '\u83B7\u53D6\u7528\u6237\u4FE1\u606F'), h('button', { 'open-type': 'openSetting' }, '\u6253\u5F00\u6388\u6743\u8BBE\u7F6E\u9875'));
    },
    classUid: 'c2794'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/native/button/index'));

exports.default = P;