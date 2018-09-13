'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../../../components/Dialog/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        show: false
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    toggleDialog: function () {
        // eslint-disable-next-line
        this.setState({
            show: !this.state.show
        });
    },
    closeDialog: function () {
        this.setState({
            show: false
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', null, '\u6F14\u793A\u7EC4\u4EF6\u6807\u7B7E\u5305\u542B\u5176\u4ED6\u5185\u5BB9'), this.state.show ? h(_ReactWX2.default.template, { $$loop: 'data1120', is: _index2.default,
            classUid: 'c1214', instanceUid: this.props.instanceUid, fragmentUid: 'f1120' }, h('view', null, this.state.title), h('view', null, '\u5F39\u7A97\u5176\u4ED6\u5185\u5BB91'), h('view', null, '\u5F39\u7A97\u5176\u4ED6\u5185\u5BB92'), h('view', null, h('button', { type: 'default', size: 'mini', onTap: this.closeDialog.bind(this), 'data-tap-uid': 'e1563', 'data-class-uid': 'c1214', 'data-instance-uid': this.props.instanceUid }, '\u5173\u95ED'))) : null, h('view', null, h('button', { type: 'primary', onTap: this.toggleDialog.bind(this), 'data-tap-uid': 'e2006', 'data-class-uid': 'c1214', 'data-instance-uid': this.props.instanceUid }, '\u70B9\u6211')));;
    },
    classUid: 'c1214'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/syntax/children/index'));

exports.default = P;