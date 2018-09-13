'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.state = {
        x: 0,
        y: 0,
        scale: 2
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    tap: function () {
        this.setState({
            x: 30,
            y: 30
        });
    },
    tap2: function () {
        this.setState({
            scale: 4
        });
    },
    onChange: function (e) {
        // eslint-disable-next-line
        console.log(e.detail);
    },
    onScale: function (e) {
        // eslint-disable-next-line
        console.log(e.detail);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        //movable-area解析成了view
        return h('view', null, h('view', { 'class': 'page-body' }, h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, 'movable-view\u533A\u57DF\u5C0F\u4E8Emovable-area'), h('movable-area', null, h('movable-view', { x: this.state.x, y: this.state.y, direction: 'all' }, 'text'))), h('view', { 'class': 'btn-area' }, h('button', { size: 'default', onTap: this.tap, 'class': 'page-body-button', type: 'primary', 'data-tap-uid': 'e2888', 'data-class-uid': 'c4841', 'data-instance-uid': this.props.instanceUid }, 'click me to move to (30px, 30px)')), h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, 'movable-view\u533A\u57DF\u5927\u4E8Emovable-area'), h('movable-area', null, h('movable-view', { 'class': 'max', direction: 'all' }, 'text'))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, '\u53EA\u53EF\u4EE5\u6A2A\u5411\u79FB\u52A8'), h('movable-area', null, h('movable-view', { direction: 'horizontal' }, 'text'))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, '\u53EA\u53EF\u4EE5\u7EB5\u5411\u79FB\u52A8'), h('movable-area', null, h('movable-view', { direction: 'vertical' }, 'text'))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, '\u53EF\u8D85\u51FA\u8FB9\u754C'), h('movable-area', null, h('movable-view', { direction: 'all', 'out-of-bounds': true }, 'text'))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, '\u5E26\u6709\u60EF\u6027'), h('movable-area', null, h('movable-view', { direction: 'all', inertia: true }, 'text'))), h('view', { 'class': 'page-section' }, h('view', { 'class': 'page-section-title' }, '\u53EF\u653E\u7F29'), h('movable-area', { 'scale-area': true }, h('movable-view', { direction: 'all', onChange: this.onChange, onScale: this.onScale, scale: true, 'scale-min': '0.5', 'scale-max': '4', 'scale-value': this.state.scale, 'data-change-uid': 'e7862', 'data-class-uid': 'c4841', 'data-instance-uid': this.props.instanceUid, 'data-scale-uid': 'e7974' }, 'text'))), h('view', { 'class': 'btn-area' }, h('button', { onTap: this.tap2, 'class': 'page-body-button', type: 'primary', 'data-tap-uid': 'e8969', 'data-class-uid': 'c4841', 'data-instance-uid': this.props.instanceUid }, 'click me to scale to 3.0'))));;
    },
    classUid: 'c4841'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/movableView/index'));

exports.default = P;