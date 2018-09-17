'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MouseTracker(props) {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 4, y: 5 };
}

MouseTracker = _ReactWX2.default.miniCreateClass(MouseTracker, _ReactWX2.default.Component, {
    handleMouseMove: function (event) {
        var e;
        if (event.type == 'touchmove') {
            e = event.touches[0];
        } else {
            e = event;
        }
        this.setState({
            x: e.pageX,
            y: e.pageY
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { onTouchMove: this.handleMouseMove, style: _ReactWX2.default.collectStyle({ height: '100%' }, this.props, "style1106"), 'data-touchmove-uid': 'e1168', 'data-class-uid': 'c880', 'data-instance-uid': this.props.instanceUid }, h('view', null, 'Move the mouse around!'), h('view', null, 'The current mouse position', this.props.renderUid, ' is (', this.state.x, ', ', this.state.y, ')'), h('view', null, h(_ReactWX2.default.renderProps, { instanceUid: this.props.instanceUid, classUid: 'c880' }), this.props.render(this.state)));;
    },
    classUid: 'c880'
}, {});

exports.default = MouseTracker;