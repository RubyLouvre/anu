'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
var now = Date.now();

function RightNav() {
    this.state = {
        toView: 'index12',
        scrollTop: 0
    };
}

RightNav = _ReactWX2.default.miniCreateClass(RightNav, _ReactWX2.default.Component, {
    scroll: function (e) {
        let height = e.detail.scrollTop;
        let index = parseInt(height / this.props.itemHeight);
        this.props.scrollLeftTab(index);
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'nav_right' }, this.props.data.length > 0 && this.props.data[this.props.index].tree.nodes ? h('scroll-view', { 'class': 'scroll-view', 'scroll-y': true, 'scroll-into-view': this.props.toView, 'scroll-with-animation': true, onScroll: this.scroll.bind(this), 'scroll-top': this.props.scrollTop, 'data-scroll-uid': 'e842875', 'data-class-uid': 'c783008', 'data-instance-uid': this.props.instanceUid }, this.props.data.map(function (item, i981) {
            return h('view', { key: item.id, 'class': 'nav_right_content', id: 'index' + item.id }, h('view', { 'class': 'nav_right_title' }, item.tree.desc), item.tree.nodes.map(function (item, i1281) {
                return h('view', { className: 'nav_right_items', key: item.desc }, h('navigator', { url: '../list/index?brand=' + item.desc + '&typeid=' + this.props.data[this.props.index].id }, h('view', { className: 'right_items' }, item.logo ? h('image', { src: item.logo }) : h('image', { src: 'http://temp.im/50x30' }), item.desc && h('text', null, item.desc))));
            }, this));
        }, this)) : h('view', null, '\u6682\u65E0\u6570\u636E'));;
    },
    classUid: 'c783008'
}, {});

exports.default = RightNav;