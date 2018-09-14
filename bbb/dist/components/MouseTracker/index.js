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
        this.setState({
            x: event.pageX,
            y: event.pageY
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { onMouseMove: this.handleMouseMove, style: _ReactWX2.default.collectStyle({ height: '100%' }, this.props, "style844"), 'data-mousemove-uid': 'e906', 'data-class-uid': 'c749', 'data-instance-uid': this.props.instanceUid }, h('view', null, 'Move the mouse around!'), h('view', null, 'The current mouse position', this.props.renderUid, ' is (', this.state.x, ', ', this.state.y, ')'), h('view', null, h(_ReactWX2.default.renderProps, { renderUid: this.props, classUid: 'c749' }), this.props.render(this.state)));;
    },
    classUid: 'c749'
}, {});

exports.default = MouseTracker;