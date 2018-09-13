'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function P() {
    this.order = ['red', 'yellow', 'blue', 'green', 'red'];
    this.state = {
        toView: 'red',
        scrollTop: 100
    };
}

P = _ReactWX2.default.miniCreateClass(P, _ReactWX2.default.Component, {
    upper: function (e) {
        // eslint-disable-next-line
        console.log(e);
    },
    lower: function (e) {
        // eslint-disable-next-line
        console.log(e);
    },
    scroll: function (e) {
        // eslint-disable-next-line
        console.log(e);
    },
    tap: function () {
        for (var i = 0; i < this.order.length; ++i) {
            if (this.order[i] === this.state.toView) {
                this.setState({
                    toView: this.order[i + 1]
                });
                break;
            }
        }
    },
    tapMove: function () {
        var _self = this;
        this.setState({
            scrollTop: _self.state.scrollTop + 10
        });
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { 'class': 'container' }, h('view', { 'class': 'section' }, h('view', {
            'class': 'section__title' }, 'vertical scroll'), h('scroll-view', { 'scroll-y': true, style: 'height: 200px; overflow: hidden;', onScrolltoupper: this.upper, onScrolltolower: this.lower, onScroll: this.scroll, 'scroll-into-div': this.state.todiv, 'scroll-top': this.state.scrollTop, 'data-scrolltoupper-uid': 'e2564', 'data-class-uid': 'c3032', 'data-instance-uid': this.props.instanceUid, 'data-scrolltolower-uid': 'e2670', 'data-scroll-uid': 'e2770' }, h('view', { id: 'green', 'class': 'scroll-view-item bc_green' }), h('view', { id: 'red', 'class': 'scroll-view-item bc_red' }), h('view', { id: 'yellow', 'class': 'scroll-view-item bc_yellow' }), h('view', { id: 'blue', 'class': 'scroll-view-item bc_blue' })), h('view', { 'class': 'btn-area' }, h('button', { size: 'mini', onTap: this.tap, 'data-tap-uid': 'e3942', 'data-class-uid': 'c3032', 'data-instance-uid': this.props.instanceUid }, 'click me to scroll into div', ' '), h('button', { size: 'mini', onTap: this.tapMove, 'data-tap-uid': 'e4260', 'data-class-uid': 'c3032', 'data-instance-uid': this.props.instanceUid }, 'click me to scroll'))), h('view', { 'class': 'section section_gap' }, h('view', { 'class': 'section__title' }, 'horizontal scroll'), h('scroll-view', { 'class': 'scroll-view_H', 'scroll-x': true, style: 'width: 100%' }, h('view', { id: 'green', 'class': 'scroll-view-item_H bc_green' }), h('view', { id: 'red', 'class': 'scroll-view-item_H bc_red' }), h('view', { id: 'yellow', 'class': 'scroll-view-item_H bc_yellow' }), h('view', { id: 'blue', 'class': 'scroll-view-item_H bc_blue' }))));;
    },
    classUid: 'c3032'
}, {});
Page(_ReactWX2.default.createPage(P, 'pages/demo/native/scrollView/index'));

exports.default = P;