'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require('../../ReactWX');

var _ReactWX2 = _interopRequireDefault(_ReactWX);

var _index = require('../../components/navRight/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Classify() {
    this.state = {
        curNav: 12,
        navLeftItems: [],
        navRightItems: [],
        curIndex: 0,
        toView: 'index12',
        scrollTop: 0,
        itemHeight: 288
    };
}

Classify = _ReactWX2.default.miniCreateClass(Classify, _ReactWX2.default.Component, {
    componentWillMount: function () {
        var that = this;
        wx.request({
            url: 'http://yapi.demo.qunar.com/mock/17668/wemall/goodstype/typebrandList',
            method: 'GET',
            data: {},
            header: {
                Accept: 'application/json'
            },
            success: function (res) {
                that.setState({
                    navLeftItems: res.data.left,
                    navRightItems: res.data.right
                });
            }
        });
    },
    switchRightTab: function (id, index) {
        let height = this.state.itemHeight;
        this.setState({
            curNav: id,
            curIndex: index,
            toView: 'index' + id,
            scrollTop: height * index
        });
    },
    scrollLeftTab: function (index) {
        // eslint-disable-next-line
        console.log('index12', index);
        let id = this.state.navLeftItems[index].id;
        let height = this.state.itemHeight;
        if (index !== this.state.curIndex) {
            this.setState({
                curNav: id,
                curIndex: index,
                toView: 'index' + id,
                scrollTop: height * index
            });
        }
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', { className: 'chat-container' }, h('view', { className: 'nav_left' }, this.state.navLeftItems.map(function (item, index) {
            return h('view', { key: item.id, className: 'nav_left_items ' + (this.state.curIndex === index ? 'active' : ''), onTap: this.switchRightTab.bind(this, item.id, index), 'data-tap-uid': 'e22102264', 'data-class-uid': 'c1022858', 'data-instance-uid': this.props.instanceUid, 'data-key': index }, item.desc);
        }, this)), h(_ReactWX2.default.template, { data: this.state.navRightItems, id: this.state.curNav, index: this.state.curIndex, toView: this.state.toView, scrollLeftTab: this.scrollLeftTab.bind(this), scrollTop: this.state.scrollTop, itemHeight: this.state.itemHeight, templatedata: 'data99212088', is: _index2.default }));;
    },
    classUid: 'c1022858'
}, {});
Page(_ReactWX2.default.createPage(Classify, 'pages/classify/index'));

exports.default = Classify;