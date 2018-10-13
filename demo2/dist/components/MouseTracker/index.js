'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX.js');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MouseTracker() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 4, y: 5 };
}

MouseTracker = _ReactWX2.default.toClass(MouseTracker, _ReactWX2.default.Component, {
    handleMouseMove: function (e) {
        this.setState({
            x: e.x,
            y: e.y
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { onTap: this.handleMouseMove, style: _ReactWX2.default.toStyle({ height: '1000rpx' }, this.props, 'style807'), 'data-click-uid': 'e868', 'data-class-uid': 'c691' }, h('view', null, '\u968F\u673A\u70B9\u51FB\u9875\u9762!'), h('view', null, 'The current mouse position is (', this.state.x, ', ', this.state.y, ')'), h('view', null, h(_ReactWX2.default.toRenderProps, null), this.props.render(this.state)));
    },
    classUid: 'c691'
}, {});
Component(_ReactWX2.default.registerComponent(MouseTracker, 'MouseTracker'));

exports.default = MouseTracker;