'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P(props) {
    this.state = {
        defaultSize: 'default',
        primarySize: 'default',
        warnSize: 'default',
        disabled: false,
        plain: false,
        loading: false
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
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
        console.log(e.detail.errMsg);
        console.log(e.detail.userInfo);
        console.log(e.detail.rawData);
    },
    render: function () {
        return _ReactWX2.default.createElement('view', { 'class': 'container' }, _ReactWX2.default.createElement('button', { type: 'default', size: this.state.defaultSize, loading: this.state.loading, plain: this.state.plain, disabled: this.state.disabled, bindtap: 'default', 'hover-class': 'other-button-hover' }, ' default '), _ReactWX2.default.createElement('button', { type: 'primary', size: this.state.primarySize, loading: this.state.loading, plain: this.state.plain, disabled: this.state.disabled, bindtap: 'primary' }, ' primary '), _ReactWX2.default.createElement('button', { type: 'warn', size: this.state.warnSize, loading: this.state.loading, plain: this.state.plain, disabled: this.state.disabled, bindtap: 'warn' }, ' warn '), _ReactWX2.default.createElement('button', { bindtap: 'setDisabled' }, '\u70B9\u51FB\u8BBE\u7F6E\u4EE5\u4E0A\u6309\u94AEdisabled\u5C5E\u6027'), _ReactWX2.default.createElement('button', { bindtap: 'setPlain' }, '\u70B9\u51FB\u8BBE\u7F6E\u4EE5\u4E0A\u6309\u94AEplain\u5C5E\u6027'), _ReactWX2.default.createElement('button', { bindtap: 'setLoading' }, '\u70B9\u51FB\u8BBE\u7F6E\u4EE5\u4E0A\u6309\u94AEloading\u5C5E\u6027'), _ReactWX2.default.createElement('button', { 'open-type': 'contact' }, '\u8FDB\u5165\u5BA2\u670D\u4F1A\u8BDD'), _ReactWX2.default.createElement('button', { 'open-type': 'getUserInfo', lang: 'zh_CN', bindgetuserinfo: 'onGotUserInfo' }, '\u83B7\u53D6\u7528\u6237\u4FE1\u606F'), _ReactWX2.default.createElement('button', { 'open-type': 'openSetting' }, '\u6253\u5F00\u6388\u6743\u8BBE\u7F6E\u9875'));;
    },
    classCode: 'c23105801961501027'
}, {});

Page(_ReactWX2.default.createPage(P, "pages/demo/form/button/index"));
exports.default = P;